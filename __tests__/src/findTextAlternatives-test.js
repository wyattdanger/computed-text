import findTextAlternatives from '../../src/findTextAlternatives';

describe('findTextAlternatives', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('returns the calculated text alternative for the given element', () => {
    const targetNode = document.createElement('select');
    document.body.appendChild(targetNode);
    expect(findTextAlternatives(targetNode, {}, true)).toBe('');
  });

  test('Image with no text alternative', () => {
    const img = document.body.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    const result = findTextAlternatives(img);
    expect(result).toBe('smile.jpg');
  });

  test('Image with alt text', () => {
    const img = document.body.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    img.alt = 'Smile!';
    const result = findTextAlternatives(img);
    expect(result).toBe('Smile!');
  });

  test('Input type image with alt text', () => {
    const img = document.body.appendChild(document.createElement('input'));
    img.type = 'image';
    img.src = 'smile.jpg';
    img.alt = 'Smile!';
    const result = findTextAlternatives(img);
    expect(result).toBe('Smile!');
  });

  test('Image with aria label', () => {
    const img = document.body.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    img.setAttribute('aria-label', 'Smile!');
    const result = findTextAlternatives(img);
    expect(result).toBe('Smile!');
  });

  test('Image with aria labelledby', () => {
    const id = 'id';
    const img = document.body.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    const label = document.body.appendChild(document.createElement('div'));
    label.textContent = 'Smile!';
    label.id = id;
    img.setAttribute('aria-labelledby', id);
    const result = findTextAlternatives(img);
    expect(result).toBe('Smile!');
  });

  test('Image with title', () => {
    const img = document.body.appendChild(document.createElement('img'));
    img.src = 'smile.jpg';
    img.setAttribute('title', 'Smile!');
    const result = findTextAlternatives(img);
    expect(result).toBe('Smile!');
  });


  test('Link with aria-hidden text', () => {
    const anchor = document.body.appendChild(document.createElement('a'));
    anchor.href = '#';
    anchor.innerHTML = '<span aria-hidden="true">X</span><span>Close this window</span>';
    const result = findTextAlternatives(anchor);
    expect(result).toBe('Close this window');
  });

  test('Link with aria-labelledby aria-hidden text', () => {
    const anchor = document.body.appendChild(document.createElement('a'));
    anchor.href = '#';
    anchor.setAttribute('aria-labelledby', 'foobar');
    anchor.innerHTML = '<span id="foobar" aria-hidden="true">X</span><span>Close this window</span>';
    const result = findTextAlternatives(anchor);
    expect(result).toBe('X');
  });

  test('Link with aria-labelledby element with aria-label', () => {
    const anchor = document.body.appendChild(document.createElement('a'));
    anchor.href = '#';
    anchor.setAttribute('aria-labelledby', 'foobar');
    const label = document.body.appendChild(document.createElement('span'));
    label.setAttribute('id', 'foobar');
    label.setAttribute('aria-label', 'Learn more about trout fishing');
    const result = findTextAlternatives(anchor);
    expect(result).toBe('Learn more about trout fishing');
  });

  test('Text node', () => {
    const text = 'Hello World';
    document.body.appendChild(document.createTextNode(text));
    const result = findTextAlternatives(document.body);
    expect(result).toBe(text);
  });

  test('Returns null if no node', () => {
    expect(findTextAlternatives(null)).toBe(null);
  });

  test('Returns null for hidden nodes', () => {
    const node = document.body.appendChild(document.createElement('div'));
    node.style.display = 'none';
    node.innerText = 'Hello World';
    const result = findTextAlternatives(node);
    expect(result).toBe(null);
  });

  test('foo', () => {
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
    const result = findTextAlternatives(document.body);
    expect(result).toBe('Hello World is this thing on? Foo Aria Label Why Submit Text Node');
  });
});
