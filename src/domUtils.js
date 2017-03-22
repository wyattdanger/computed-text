/* global HTMLSlotElement */

const shadowHost = (fragment) => {
  // If host exists, this is a Shadow DOM fragment.
  if ('host' in fragment) {
    return fragment.host;
  }
  return null;
};

const composedParentNode = (node) => {
  if (!node) {
    return null;
  }
  if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    return shadowHost((node));
  }

  const parentNode = node.parentNode;
  if (!parentNode) {
    return null;
  }

  if (parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    return shadowHost((parentNode));
  }

  if (!parentNode.shadowRoot) {
    return parentNode;
  }

  // Shadow DOM v1
  if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
    const { assignedSlot } = node;
    if (HTMLSlotElement && assignedSlot instanceof HTMLSlotElement) {
      return composedParentNode(assignedSlot);
    }
  }

  // Shadow DOM v0
  if (typeof node.getDestinationInsertionPoints === 'function') {
    const insertionPoints = node.getDestinationInsertionPoints();
    if (insertionPoints.length > 0) {
      return composedParentNode(insertionPoints[insertionPoints.length - 1]);
    }
  }

  return null;
};

const parentElement = (node) => {
  if (!node) {
    return null;
  }

  const parentNode = composedParentNode(node);

  if (!parentNode) {
    return null;
  }

  switch (parentNode.nodeType) {
    case Node.ELEMENT_NODE:
      return parentNode;
    default:
      return parentElement(parentNode);
  }
};

const asElement = (node) => {
  let element;
  if (!node) {
    return null;
  }
  switch (node.nodeType) {
    case Node.COMMENT_NODE:
      return null;  // Skip comments
    case Node.ELEMENT_NODE:
      element = node;
      if (element.localName === 'script' || element.localName === 'template') {
        return null;  // Skip script-supporting elements
      }
      return element;
    case Node.DOCUMENT_FRAGMENT_NODE:
      return node.host;
    case Node.TEXT_NODE:
      return parentElement(node);
    default:
      console.warn('Unhandled node type: ', node.nodeType);
  }
  return null;
};

export {
  asElement,
  shadowHost,
  parentElement,
  composedParentNode,
};
