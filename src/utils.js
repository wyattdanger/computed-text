import { parentElement } from './domUtils';
import { ARIA_ROLES } from './constants';

const elementIsAriaWidget = (element) => {
  if (element.hasAttribute('role')) {
    const roleValue = element.getAttribute('role');
    if (roleValue) {
      const role = ARIA_ROLES[roleValue];
      if (role && 'widget' in role.parent) {
        return true;
      }
    }
  }
  return false;
};

const elementIsHtmlControl = (element) => {
  const defaultView = element.ownerDocument.defaultView;

  // HTML control
  if (element instanceof defaultView.HTMLButtonElement) { return true; }
  if (element instanceof defaultView.HTMLInputElement) { return true; }
  if (element instanceof defaultView.HTMLSelectElement) { return true; }
  if (element instanceof defaultView.HTMLTextAreaElement) { return true; }

  return false;
};

const isElementHidden = (element) => {
  const style = window.getComputedStyle(element, null);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return true;
  }

  if (element.hasAttribute('aria-hidden') &&
      element.getAttribute('aria-hidden').toLowerCase() === 'true') {
    return true;
  }

  return false;
};

const isElementOrAncestorHidden = (element) => {
  if (isElementHidden(element)) {
    return true;
  }

  if (parentElement(element)) {
    return isElementOrAncestorHidden(parentElement(element));
  }

  return false;
};

export {
  elementIsAriaWidget,
  elementIsHtmlControl,
  isElementOrAncestorHidden,
};
