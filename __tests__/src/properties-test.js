import {
  getLastWord,
  getTextFromAriaLabelledby,
  getTextFromHostLanguageAttributes,
  getTextFromDescendantContent,
} from '../../src/properties';


describe('getTextFromDescendantContent', () => {
  test('returns text from the descendants of the element', () => {
    const html = `<label>
      <input type="radio" id="reason_Screenshot" name="reason" value="screenshot"></input>
    </label>`;
    document.body.innerHTML = html;
    const targetNode = document.querySelector('label');
    expect(getTextFromDescendantContent(targetNode)).toBe('');
  });
});

describe('getTextFromHostLanguageAttributes', () => {
  test('does not crash when targetNode has a numeric id attribute', () => {
    const targetNode = document.createElement('input');
    targetNode.setAttribute('id', '123_user');
    document.body.appendChild(targetNode);
    expect(getTextFromHostLanguageAttributes(targetNode, {}, null)).toBe(null);
  });
});
