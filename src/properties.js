/* eslint no-param-reassign:0, no-use-before-define:0 no-plusplus:0 */

import computedText from './computedText';

const getTextFromAriaLabelledby = (element) => {
  if (!element.hasAttribute('aria-labelledby')) {
    return null;
  }

  return element.getAttribute('aria-labelledby')
    .split(' ')
    .map(id => document.getElementById(id))
    .filter(Boolean)
    .map(node => computedText(node, { includeHidden: true }))
    .join(' ');
};

const getTextFromHostLanguageAttributes = (element) => {
  if (element.matches('img') && element.hasAttribute('alt')) {
    return element.getAttribute('alt');
  }

  if (element.matches('img') && !element.hasAttribute('alt')) {
    return element.getAttribute('title') || element.getAttribute('src');
  }

  const controlsSelector = [
    'input:not([type="hidden"]):not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'video:not([disabled])',
  ].join(', ');

  if (element.matches(controlsSelector)) {
    const labels = Array.from(document.querySelectorAll('label'));
    const label = labels.find(node => node.control === element);

    if (label) {
      return computedText(label);
    }

    if (element.matches('input[type="image"]') && element.hasAttribute('alt')) {
      const alt = element.getAttribute('alt');
      return alt;
    }
  }
  return null;
};

const getTextFromDescendantContent = (element, { includeHidden = false } = {}) =>
  Array.from(element.childNodes)
      .map(child => computedText(child, { includeHidden }))
      .map(text => text && text.trim())
      .filter(Boolean)
      .join(' ') || null;

export {
  getTextFromAriaLabelledby,
  getTextFromHostLanguageAttributes,
  getTextFromDescendantContent,
};

