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

Heavily based on the `findTextAlternatives` method in
[GoogleChrome/accessibility-developer-tools](https://github.com/GoogleChrome/accessibility-developer-tools)
