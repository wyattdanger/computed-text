import { parentElement } from './domUtils';
import { ARIA_ROLES } from './constants';

const elementIsAriaWidget = (element) => {
  if (element.hasAttribute('role')) {
    const roleValue = element.getAttribute('role');
    // TODO is this correct?
    if (roleValue) {
      const role = ARIA_ROLES[roleValue];
      if (role && 'widget' in role.allParentRolesSet) { return true; }
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
  let chromevoxignoreariahidden;

  if (!(element instanceof element.ownerDocument.defaultView.HTMLElement)) {
    return false;
  }

  if (element.hasAttribute('chromevoxignoreariahidden')) {
    chromevoxignoreariahidden = true;
  }

  const style = window.getComputedStyle(element, null);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return true;
  }

  if (element.hasAttribute('aria-hidden') &&
      element.getAttribute('aria-hidden').toLowerCase() === 'true') {
    return !chromevoxignoreariahidden;
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

const matchSelector = (element, selector) => {
  if (element.matches) {
    return element.matches(selector);
  }
  if (element.webkitMatchesSelector) {
    return element.webkitMatchesSelector(selector);
  }
  if (element.mozMatchesSelector) {
    return element.mozMatchesSelector(selector);
  }
  if (element.msMatchesSelector) {
    return element.msMatchesSelector(selector);
  }
  return false;
};

export {
  elementIsAriaWidget,
  elementIsHtmlControl,
  isElementOrAncestorHidden,
  matchSelector,
};
