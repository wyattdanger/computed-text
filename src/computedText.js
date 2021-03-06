/* eslint no-param-reassign:0 */

import { roles } from 'aria-query';
import { getTextFromAriaLabelledby, getTextFromDescendantContent, getTextFromHostLanguageAttributes } from './properties';
import { asElement } from './domUtils';
import { elementIsAriaWidget, elementIsHtmlControl, isElementOrAncestorHidden } from './utils';


const computedText = (node, { includeHidden = false } = {}) => {
  const element = asElement(node);

  if (!element) {
    return null;
  }

  // 1. Skip hidden elements unless the author specifies to use them via an aria-labelledby or
  // aria-describedby being used in the current computation.
  if (!includeHidden && isElementOrAncestorHidden(element)) {
    return null;
  }

  // if this is a text node, just return text content.
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  // 2A. The aria-labelledby attribute takes precedence as the element's text alternative
  // unless this computation is already occurring as the result of a recursive aria-labelledby
  // declaration.
  const ariaLabelledBy = getTextFromAriaLabelledby(element);
  if (ariaLabelledBy) {
    return ariaLabelledBy;
  }

  // 2A. If aria-labelledby is empty or undefined, the aria-label attribute, which defines an
  // explicit text string, is used.
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // 2A. If aria-labelledby and aria-label are both empty or undefined, and if the element is not
  // marked as presentational (role="presentation", check for the presence of an equivalent host
  // language attribute or element for associating a label, and use those mechanisms to determine
  // a text alternative.
  if (!element.hasAttribute('role') || element.getAttribute('role') !== 'presentation') {
    const textFromAttributes = getTextFromHostLanguageAttributes(element);
    if (textFromAttributes) {
      return textFromAttributes;
    }
  }

  // 2B (HTML version).
  if (elementIsHtmlControl(element)) {
    const defaultView = element.ownerDocument.defaultView;

    // include the value of the embedded control as part of the text alternative in the
    // following manner:
    if (element instanceof defaultView.HTMLInputElement) {
      // If the embedded control is a text field, use its value.
      const inputElement = /** @type {HTMLInputElement} */ (element);
      if (inputElement.type === 'text') {
        if (inputElement.value && inputElement.value.length > 0) {
          return inputElement.value;
        }
      }
      // If the embedded control is a range (e.g. a spinbutton or slider), use the value of the
      // aria-valuetext attribute if available, or otherwise the value of the aria-valuenow
      // attribute.
      if (inputElement.type === 'range') {
        return inputElement.value;
      }
    }
    // If the embedded control is a menu, use the text alternative of the chosen menu item.
    // If the embedded control is a select or combobox, use the chosen option.
    if (element instanceof defaultView.HTMLSelectElement) {
      const inputElement = /** @type {HTMLSelectElement} */ (element);
      return inputElement.value;
    }
  }

  // 2B (ARIA version).
  if (elementIsAriaWidget(element)) {
    const role = element.getAttribute('role');
    // If the embedded control is a text field, use its value.
    if (role === 'textbox') {
      if (element.textContent && element.textContent.length > 0) {
        return element.textContent;
      }
    }
    // If the embedded control is a range (e.g. a spinbutton or slider), use the value of the
    // aria-valuetext attribute if available, or otherwise the value of the aria-valuenow
    // attribute.
    if (role === 'slider' || role === 'spinbutton') {
      if (element.hasAttribute('aria-valuetext')) {
        return element.getAttribute('aria-valuetext');
      } else if (element.hasAttribute('aria-valuenow')) {
        return element.getAttribute('aria-valuenow');
      }
    }
    // If the embedded control is a menu, use the text alternative of the chosen menu item.
    if (role === 'menu') {
      const menuitems = element.querySelectorAll('[role=menuitemcheckbox], [role=menuitemradio]');
      const selectedMenuitems = [];
      menuitems.forEach((item) => {
        if (item.getAttribute('aria-checked') === 'true') {
          selectedMenuitems.push(item);
        }
      });
      if (selectedMenuitems.length > 0) {
        selectedMenuitems.map(selectedMenuitem => computedText(selectedMenuitem));
        return selectedMenuitems.join(', ');
      }
    }
    // If the embedded control is a select or combobox, use the chosen option.
    if (role === 'combobox' || role === 'select') {
      // TODO
      return 'TODO';
    }
  }

  // 2C. Otherwise, if the attributes checked in rules A and B didn't provide results, text is
  // collected from descendant content if the current element's role allows "Name From: contents."
  const hasRole = element.hasAttribute('role');
  let canGetNameFromContents = true;
  if (hasRole) {
    const roleName = element.getAttribute('role');
    const role = roles.get(roleName);
    if (!role.nameFrom.includes('contents')) {
      canGetNameFromContents = false;
    }
  }

  if (canGetNameFromContents) {
    return getTextFromDescendantContent(element, { includeHidden });
  }

  // 2D. The last resort is to use text from a tooltip attribute (such as the title attribute in
  // HTML). This is used only if nothing else, including subtree content, has provided results.
  if (element.hasAttribute('title')) {
    return element.getAttribute('title');
  }

  return null;
};

export default computedText;
