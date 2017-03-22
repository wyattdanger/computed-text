import computedText from '../../src/computedText';

describe('computedText', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Image with no text alternative', () => {
    document.body.innerHTML = `
      <img src="smile.jpg" />
    `;
    expect(computedText(document.body)).toBe('smile.jpg');
  });

  test('Image with alt text', () => {
    document.body.innerHTML = `
      <img src="smile.jpg" alt="Smile!" />
    `;
    expect(computedText(document.body)).toBe('Smile!');
  });

  test('Input type image with alt text', () => {
    document.body.innerHTML = `
    <form>
      <input type="image" src="smile.jpg" alt="Smile!" id="foo" />
      </form>
    `;
    expect(computedText(document.body)).toBe('Smile!');
  });

  test('Image with aria label', () => {
    document.body.innerHTML = `
      <img src="smile.jpg" type="image" aria-label="Smile!" />
    `;
    expect(computedText(document.body)).toBe('Smile!');
  });

  test('Image with aria labelledby', () => {
    document.body.innerHTML = `
      <img src="smile.jpg" aria-labelledby="foo" />
      <div id="foo" aria-hidden="true">Smile!</div>
    `;
    expect(computedText(document.body)).toBe('Smile!');
  });

  test('Image with title', () => {
    document.body.innerHTML = `
      <img src="smile.jpg" type="image" title="Smile!" />
    `;
    expect(computedText(document.body)).toBe('Smile!');
  });


  test('Link with aria-hidden text', () => {
    document.body.innerHTML = `
      <a href="/"><span aria-hidden="true">X</span><span>Close this window</span></a>
    `;
    expect(computedText(document.body)).toBe('Close this window');
  });

  test('Link with aria-labelledby aria-hidden text', () => {
    document.body.innerHTML = `
      <a href="/" aria-labelledby="foobar">
        <span id="foobar" aria-hidden="true">X</span>
        <span>Close this window</span>
      </a>
    `;
    expect(computedText(document.body)).toBe('X');
  });

  test('Link with aria-labelledby element with aria-label', () => {
    document.body.innerHTML = `
      <a href="/" aria-labelledby="foobar" />
      <span id="foobar" aria-label="Baz" />
    `;
    expect(computedText(document.body)).toBe('Baz');
  });

  test('Text node', () => {
    const text = 'Hello World';
    document.body.innerHTML = `
      ${text}
    `;
    expect(computedText(document.body)).toBe(text);
  });

  test('Returns null if no node', () => {
    document.body.innerHTML = '';
    expect(computedText(null)).toBe(null);
  });

  test('Returns null for hidden nodes', () => {
    document.body.innerHTML = `
      <div style="display: none;">Invisible!</div>
    `;
    expect(computedText(document.body)).toBe(null);
  });

  test('this needs to be broken into smaller pieces', () => {
    document.body.innerHTML = `
      <h1>Hello World</h1>
      <p>is this thing on?</p>
      <img src="foo.jpg" alt="Foo" />
      <form>
        <input type="text" aria-label="Aria Label" id="bar" value="Bar" />
        <textarea aria-label="Why" value=""></textarea>
        <button type="submit">Submit</button>
      </form>
      <div role="presentation">Ignore Me?</div>
      Text Node
    `;
    expect(computedText(document.body)).toBe('Hello World is this thing on? Foo Aria Label Why Submit Text Node');
  });

  test('select tags with no option selected', () => {
    document.body.innerHTML = `
      <label for="foo">
        Foo
        <select name="foo" id="foo">
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </label>
    `;
    expect(computedText(document.body)).toBe('Foo 1');
  });

  test('select tags with an option selected', () => {
    document.body.innerHTML = `
      <label for="foo">Foo</label>
      <select name="foo" id="foo">
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3" selected>Three</option>
      </select>
    `;
    expect(computedText(document.body)).toBe('Foo 3');
  });

  test('skips comments', () => {
    document.body.innerHTML = `
      <!-- Comment -->
    `;
    expect(computedText(document.body)).toBe(null);
  });
});
