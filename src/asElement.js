const asElement = (node) => {
  let element;
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
      return axs.dom.parentElement(node);
    default:
      console.warn('Unhandled node type: ', node.nodeType);
  }
  return null;
};

export default asElement;
