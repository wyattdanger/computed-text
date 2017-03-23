import {
  getTextFromHostLanguageAttributes,
  getTextFromDescendantContent,
} from '../../src/properties';


describe('getTextFromDescendantContent', () => {
  test('returns text from the descendants of the element', () => {
    document.body.innerHTML = `<label>
      <input type="radio" id="reason_Screenshot" name="reason" value="screenshot"></input>
    </label>`;
    expect(getTextFromDescendantContent(document.body)).toBe(null);
  });
});

describe('getTextFromHostLanguageAttributes', () => {
  test('does not crash when targetNode has a numeric id attribute', () => {
    document.body.innerHTML = `
      <input id="123_user" />
    `;
    expect(getTextFromHostLanguageAttributes(document.body)).toBe(null);
  });
});
