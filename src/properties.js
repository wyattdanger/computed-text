/* eslint no-param-reassign:0, no-use-before-define:0 no-plusplus:0 */

import computedText from './computedText';
import { parentElement } from './domUtils';

const getTextFromAriaLabelledby = (element) => {
  if (!element.hasAttribute('aria-labelledby')) {
    return null;
  }

  const labelledbyAttr = element.getAttribute('aria-labelledby');
  const labelledbyIds = labelledbyAttr.split(/\s+/);
  const labelledbyValues = [];

  for (let i = 0; i < labelledbyIds.length; i++) {
    const labelledbyId = labelledbyIds[i];
    const labelledbyElement = document.getElementById(labelledbyId);
    if (!labelledbyElement) {
      throw new Error(`Expected element with id ${labelledbyId}`);
    } else {
      labelledbyValues.push(computedText(labelledbyElement, {}, true, true));
    }
  }

  if (labelledbyValues.length > 0) {
    return labelledbyValues.join(' ');
  }

  return null;
};

const getTextFromHostLanguageAttributes = (element, { recursive = false } = {}) => {
  if (element.matches('img') && element.hasAttribute('alt')) {
    return element.getAttribute('alt');
  }

  if (element.matches('img') && !element.hasAttribute('alt')) {
    return element.getAttribute('title') || element.getAttribute('src');
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
      const labelForValues = [];
      const labelForText = [];
      for (let i = 0; i < labelsFor.length; i++) {
        const labelFor = {};
        labelFor.type = 'element';
        const label = labelsFor[i];
        const labelText = computedText(label, {}, true);
        if (labelText && labelText.trim().length > 0) {
          labelFor.text = labelText.trim();
          labelForText.push(labelText.trim());
        }
        labelFor.element = label;
        labelForValues.push(labelFor);
      }
      if (labelForValues.length > 0) {
        return labelForText.join(' ');
      }
    }

    let parent = parentElement(element);
    const labelWrappedValue = {};
    while (parent) {
      if (parent.tagName.toLowerCase() === 'label') {
        const parentLabel = parent;
        if (parentLabel.control === element) {
          labelWrappedValue.type = 'element';
          labelWrappedValue.text = computedText(parentLabel, {}, true);
          labelWrappedValue.element = parentLabel;
          break;
        }
      }
      parent = parentElement(parent);
    }
    if (labelWrappedValue.text) {
      return labelWrappedValue.text;
    }
    if (element.matches('input[type="image"]') && element.hasAttribute('alt')) {
      const alt = element.getAttribute('alt');
      return alt;
    }
  }
  return null;
};

const getTextFromDescendantContent = (element, force) => {
  const children = element.childNodes;
  const childrenTextContent = [];
  for (let i = 0; i < children.length; i++) {
    const childTextContent = computedText(children[i], {}, true, force);
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
  getTextFromAriaLabelledby,
  getTextFromHostLanguageAttributes,
  getTextFromDescendantContent,
};

