`computedText(node)` returns an approximation of the text which would be read
aloud by a screen reader.

```js
test('Contrived example', () => {
  document.body.innerHTML = `
    <h1>Hello World</h1>
    <div style="display: none">I am hidden</div>
    <img src="foo.jpg" alt="Bar" />
  `;
  expect(computedText(document.body)).toBe('Hello World Bar');
});
```

Local development:
```bash
npm install
npm run test
```

Use cases:
- Verify that text which should be visible/invisible to a screen reader is marked up appropriately
- Run as an approval test in CI to detect changes in the text representation of components

Heavily based on the `findTextAlternatives` method in
[GoogleChrome/accessibility-developer-tools](https://github.com/GoogleChrome/accessibility-developer-tools)
