/* eslint no-param-reassign:0, no-use-before-define:0 no-plusplus:0 */

import { ARIA_ROLES } from './constants';
import { asElement, parentElement } from './domUtils';
import { elementIsAriaWidget, elementIsHtmlControl, isElementOrAncestorHidden } from './utils';

const findTextAlternatives = (node, textAlternatives, recursive = false, force = false) => {
  console.log(recursive, force);
  const element = asElement(node);
  if (!element) { return null; }

  // 1. Skip hidden elements unless the author specifies to use them via an aria-labelledby or
  // aria-describedby being used in the current computation.
  if (!force && isElementOrAncestorHidden(element)) {
    return null;
  }

  // if this is a text node, just return text content.
  if (node.nodeType === Node.TEXT_NODE) {
    const textContentValue = {};
    textContentValue.type = 'text';
    textContentValue.text = node.textContent;
    textContentValue.lastWord = getLastWord(textContentValue.text);
    textAlternatives.content = textContentValue;

    return node.textContent;
  }

  let computedName;

  if (!recursive) {
    // 2A. The aria-labelledby attribute takes precedence as the element's text alternative
    // unless this computation is already occurring as the result of a recursive aria-labelledby
    // declaration.
    computedName = getTextFromAriaLabelledby(element, textAlternatives);
  }

  // 2A. If aria-labelledby is empty or undefined, the aria-label attribute, which defines an
  // explicit text string, is used.
  if (element.hasAttribute('aria-label')) {
    const ariaLabelValue = {};
    ariaLabelValue.type = 'text';
    ariaLabelValue.text = element.getAttribute('aria-label');
    ariaLabelValue.lastWord = getLastWord(ariaLabelValue.text);
    if (computedName) {
      ariaLabelValue.unused = true;
    } else if (!(recursive && elementIsHtmlControl(element))) {
      computedName = ariaLabelValue.text;
    }
    textAlternatives.ariaLabel = ariaLabelValue;
  }

  // 2A. If aria-labelledby and aria-label are both empty or undefined, and if the element is not
  // marked as presentational (role="presentation", check for the presence of an equivalent host
  // language attribute or element for associating a label, and use those mechanisms to determine
  // a text alternative.
  if (!element.hasAttribute('role') || element.getAttribute('role') !== 'presentation') {
    computedName = getTextFromHostLanguageAttributes(element,
                                                     textAlternatives,
                                                     computedName,
                                                     recursive);
  }

  // 2B (HTML version).
  if (recursive && elementIsHtmlControl(element)) {
    const defaultView = element.ownerDocument.defaultView;

    // include the value of the embedded control as part of the text alternative in the
    // following manner:
    if (element instanceof defaultView.HTMLInputElement) {
      // If the embedded control is a text field, use its value.
      const inputElement = (element);
      if (inputElement.type === 'text') {
        if (inputElement.value && inputElement.value.length > 0) {
          textAlternatives.controlValue = { text: inputElement.value };
        }
      }
      // If the embedded control is a range (e.g. a spinbutton or slider), use the value of the
      // aria-valuetext attribute if available, or otherwise the value of the aria-valuenow
      // attribute.
      if (inputElement.type === 'range') { textAlternatives.controlValue = { text: inputElement.value }; }
    }
    // If the embedded control is a menu, use the text alternative of the chosen menu item.
    // If the embedded control is a select or combobox, use the chosen option.
    if (element instanceof defaultView.HTMLSelectElement) {
      const inputElement = element;
      textAlternatives.controlValue = { text: inputElement.value };
    }

    if (textAlternatives.controlValue) {
      const controlValue = textAlternatives.controlValue;
      if (computedName) { controlValue.unused = true; } else { computedName = controlValue.text; }
    }
  }

  // 2B (ARIA version).
  if (recursive && elementIsAriaWidget(element)) {
    const role = element.getAttribute('role');
    // If the embedded control is a text field, use its value.
    if (role === 'textbox') {
      if (element.textContent && element.textContent.length > 0) {
        textAlternatives.controlValue = { text: element.textContent };
      }
    }
    // If the embedded control is a range (e.g. a spinbutton or slider), use the value of the
    // aria-valuetext attribute if available, or otherwise the value of the aria-valuenow
    // attribute.
    if (role === 'slider' || role === 'spinbutton') {
      if (element.hasAttribute('aria-valuetext')) { textAlternatives.controlValue = { text: element.getAttribute('aria-valuetext') }; } else if (element.hasAttribute('aria-valuenow')) {
        textAlternatives.controlValue = { value: element.getAttribute('aria-valuenow'),
          text: `${element.getAttribute('aria-valuenow')}` };
      }
    }
    // If the embedded control is a menu, use the text alternative of the chosen menu item.
    if (role === 'menu') {
      const menuitems = element.querySelectorAll('[role=menuitemcheckbox], [role=menuitemradio]');
      const selectedMenuitems = [];
      for (let i = 0; i < menuitems.length; i++) {
        if (menuitems[i].getAttribute('aria-checked') === 'true') { selectedMenuitems.push(menuitems[i]); }
      }
      if (selectedMenuitems.length > 0) {
        let selectedMenuText = '';
        for (let i = 0; i < selectedMenuitems.length; i++) {
          selectedMenuText += findTextAlternatives(selectedMenuitems[i], {}, true);
          if (i < selectedMenuitems.length - 1) { selectedMenuText += ', '; }
        }
        textAlternatives.controlValue = { text: selectedMenuText };
      }
    }
    // If the embedded control is a select or combobox, use the chosen option.
    if (role === 'combobox' || role === 'select') {
      // TODO
      textAlternatives.controlValue = { text: 'TODO' };
    }

    if (textAlternatives.controlValue) {
      const controlValue = textAlternatives.controlValue;
      if (computedName) { controlValue.unused = true; } else { computedName = controlValue.text; }
    }
  }

  // 2C. Otherwise, if the attributes checked in rules A and B didn't provide results, text is
  // collected from descendant content if the current element's role allows "Name From: contents."
  const hasRole = element.hasAttribute('role');
  let canGetNameFromContents = true;
  if (hasRole) {
    const roleName = element.getAttribute('role');
    // if element has a role, check that it allows "Name From: contents"
    const role = ARIA_ROLES[roleName];
    if (role && (!role.namefrom || role.namefrom.indexOf('contents') < 0)) { canGetNameFromContents = false; }
  }
  const textFromContent = getTextFromDescendantContent(element, force);
  if (textFromContent && canGetNameFromContents) {
    const textFromContentValue = {};
    textFromContentValue.type = 'text';
    textFromContentValue.text = textFromContent;
    textFromContentValue.lastWord = getLastWord(textFromContentValue.text);
    if (computedName) {
      textFromContentValue.unused = true;
    } else {
      computedName = textFromContent;
    }
    textAlternatives.content = textFromContentValue;
  }

  // 2D. The last resort is to use text from a tooltip attribute (such as the title attribute in
  // HTML). This is used only if nothing else, including subtree content, has provided results.
  if (element.hasAttribute('title')) {
    const titleValue = {};
    titleValue.type = 'string';
    titleValue.valid = true;
    titleValue.text = element.getAttribute('title');
    titleValue.lastWord = getLastWord(titleValue.lastWord);
    if (computedName) { titleValue.unused = true; } else { computedName = titleValue.text; }
    textAlternatives.title = titleValue;
  }

  if (Object.keys(textAlternatives).length === 0 && !computedName) {
    return null;
  }

  return computedName;
};

const getLastWord = (text) => {
  if (!text) { return null; }

  // TODO: this makes a lot of assumptions.
  const lastSpace = text.lastIndexOf(' ') + 1;
  const MAXLENGTH = 10;
  const cutoff = text.length - MAXLENGTH;
  const wordStart = lastSpace > cutoff ? lastSpace : cutoff;
  return text.substring(wordStart);
};

const getTextFromAriaLabelledby = (element, textAlternatives) => {
  let computedName = null;
  if (!element.hasAttribute('aria-labelledby')) {
    return computedName;
  }

  const labelledbyAttr = element.getAttribute('aria-labelledby');
  const labelledbyIds = labelledbyAttr.split(/\s+/);
  const labelledbyValue = {};
  labelledbyValue.valid = true;
  const labelledbyText = [];
  const labelledbyValues = [];

  for (let i = 0; i < labelledbyIds.length; i++) {
    const labelledby = {};
    labelledby.type = 'element';
    const labelledbyId = labelledbyIds[i];
    labelledby.value = labelledbyId;
    const labelledbyElement = document.getElementById(labelledbyId);
    if (!labelledbyElement) {
      labelledby.valid = false;
      labelledbyValue.valid = false;
      labelledby.errorMessage = { messageKey: 'noElementWithId', args: [labelledbyId] };
    } else {
      labelledby.valid = true;
      labelledby.text = findTextAlternatives(labelledbyElement, {}, true, true);
      labelledby.lastWord = getLastWord(labelledby.text);
      labelledbyText.push(labelledby.text);
      labelledby.element = labelledbyElement;
    }
    labelledbyValues.push(labelledby);
  }

  if (labelledbyValues.length > 0) {
    labelledbyValues[labelledbyValues.length - 1].last = true;
    labelledbyValue.values = labelledbyValues;
    labelledbyValue.text = labelledbyText.join(' ');
    labelledbyValue.lastWord = getLastWord(labelledbyValue.text);
    computedName = labelledbyValue.text;
    textAlternatives.ariaLabelledby = labelledbyValue;
  }

  return computedName;
};

const getTextFromHostLanguageAttributes = (
  element, textAlternatives = {}, existingComputedname, recursive,
) => {
  let computedName = existingComputedname;
  if (element.matches('img') && element.hasAttribute('alt')) {
    const altValue = {};
    altValue.type = 'string';
    altValue.valid = true;
    altValue.text = element.getAttribute('alt');
    if (computedName) { altValue.unused = true; } else { computedName = altValue.text; }
    textAlternatives.alt = altValue;
  }

  const controlsSelector = ['input:not([type="hidden"]):not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'video:not([disabled])'].join(', ');
  if (element.matches(controlsSelector) && !recursive) {
    if (element.hasAttribute('id')) {
      const labelForQuerySelector = `label[for="${element.id}"]`;
      const labelsFor = document.querySelectorAll(labelForQuerySelector);
      const labelForValue = {};
      const labelForValues = [];
      const labelForText = [];
      for (let i = 0; i < labelsFor.length; i++) {
        const labelFor = {};
        labelFor.type = 'element';
        const label = labelsFor[i];
        const labelText = findTextAlternatives(label, {}, true);
        if (labelText && labelText.trim().length > 0) {
          labelFor.text = labelText.trim();
          labelForText.push(labelText.trim());
        }
        labelFor.element = label;
        labelForValues.push(labelFor);
      }
      if (labelForValues.length > 0) {
        labelForValues[labelForValues.length - 1].last = true;
        labelForValue.values = labelForValues;
        labelForValue.text = labelForText.join(' ');
        labelForValue.lastWord = getLastWord(labelForValue.text);
        if (computedName) {
          labelForValue.unused = true;
        } else {
          computedName = labelForValue.text;
        }
        textAlternatives.labelFor = labelForValue;
      }
    }

    let parent = parentElement(element);
    const labelWrappedValue = {};
    while (parent) {
      if (parent.tagName.toLowerCase() === 'label') {
        const parentLabel = parent;
        if (parentLabel.control === element) {
          labelWrappedValue.type = 'element';
          labelWrappedValue.text = findTextAlternatives(parentLabel, {}, true);
          labelWrappedValue.lastWord = getLastWord(labelWrappedValue.text);
          labelWrappedValue.element = parentLabel;
          break;
        }
      }
      parent = parentElement(parent);
    }
    if (labelWrappedValue.text) {
      if (computedName) {
        labelWrappedValue.unused = true;
      } else {
        computedName = labelWrappedValue.text;
      }
      textAlternatives.labelWrapped = labelWrappedValue;
    }
      // If all else fails input of type image can fall back to its alt text
    if (element.matches('input[type="image"]') && element.hasAttribute('alt')) {
      const altValue = {};
      altValue.type = 'string';
      altValue.valid = true;
      altValue.text = element.getAttribute('alt');
      if (computedName) { altValue.unused = true; } else { computedName = altValue.text; }
      textAlternatives.alt = altValue;
    }
    if (!Object.keys(textAlternatives).length) {
      textAlternatives.noLabel = true;
    }
  }
  return computedName;
};

const getTextFromDescendantContent = (element, force) => {
  const children = element.childNodes;
  const childrenTextContent = [];
  for (let i = 0; i < children.length; i++) {
    const childTextContent = findTextAlternatives(children[i], {}, true, force);
    if (childTextContent) { childrenTextContent.push(childTextContent.trim()); }
  }
  if (childrenTextContent.length) {
    let result = '';
    // Empty children are allowed, but collapse all of them
    for (let i = 0; i < childrenTextContent.length; i++) {
      result = [result, childrenTextContent[i]].join(' ').trim();
    }
    return result;
  }
  return null;
};

export {
  getLastWord,
  getTextFromAriaLabelledby,
  getTextFromHostLanguageAttributes,
  getTextFromDescendantContent,
};

