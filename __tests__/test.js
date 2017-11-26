import JSSoup from '../lib/JSSoup';

const data = `
  <html><head><title>The Dormouse's story</title></head>
  <body>
  <p class="title"><b>The Dormouse's story</b></p>

  <p class="story">Once upon a time there were three little sisters; and their names were
  <a href="http://example.com/elsie" class="sister" id="link1">Elsie</a>,
  <a href="http://example.com/lacie" class="sister" id="link2">Lacie</a> and
  <a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
  and they lived at the bottom of a well.</p>

  <p class="story">...</p>
  </body>
  </html>
`
describe('contents', () => {
  it('should be OK', () => {
    const soup = JSSoup.parse('<a>hello</a>');
    expect(soup.contents.length).toEqual(1);
    expect(soup.contents[0].contents.length).toEqual(1);
		soup.clear();
  });

  it('should be OK', () => {
    const soup = JSSoup.parse('<a>hello<b>aa</b>cc</a>');
    expect(soup.contents.length).toEqual(1);
    expect(soup.contents[0].contents.length).toEqual(3);
		soup.clear();
  });
});

describe('parent', () => {
  it('should be OK', () => {
    const soup = JSSoup.parse('<a>hello</a>');
    expect(soup.parent).toEqual(null);
    expect(soup.contents[0].parent).toEqual(soup);
    expect(soup.contents[0].contents[0].parent).toEqual(soup.contents[0]);
		soup.clear();
  });
});

describe('name', () => {
  it('should get correct name', () => {
    const soup = JSSoup.parse('<a>hello</a>');
    expect(soup.name).toEqual('[document]');
    expect(soup.contents[0].name).toEqual('a');
		soup.clear();
  });

  it('should not have name for SoupString', () => {
    const soup = JSSoup.parse('<a>hello</a>');
    expect(soup.contents[0].contents[0].name).toEqual(undefined);
    soup.clear();
  });
});

describe('string', () => {
  it('should print text in first level without sub tag', () => {
    const soup = JSSoup.parse('<a>text</a>');
    expect(soup.contents[0].string.toString()).toMatch('text');
		soup.clear();
  });

  it('should print text in deepest level without sub tag', () => {
    const soup = JSSoup.parse('<a><b><c>text</c></b></a>');
    expect(soup.string.toString()).toMatch('text');
		soup.clear();
  });

  it('should return undefined with sub tag', () => {
    const soup = JSSoup.parse('<a>ab<b>text</b></a>');
    expect(soup.string).toEqual(undefined);
    soup.clear();
  });

  it('should return undefined with nothing', () => {
    const soup = JSSoup.parse('<a></a>');
    expect(soup.string).toEqual(undefined);
    soup.clear();
  });
});

describe('sibling', () => {
  it('should be OK without sibling', () => {
    const soup = JSSoup.parse('<a>hello</a>');
    expect(soup.previousSibling).toEqual(undefined);
    expect(soup.nextSibling).toEqual(undefined);
    expect(soup.contents[0].previousSibling).toEqual(undefined);
    expect(soup.contents[0].nextSibling).toEqual(undefined);
    expect(soup.contents[0].contents[0].previousSibling).toEqual(undefined);
    expect(soup.contents[0].contents[0].nextSibling).toEqual(undefined);
    soup.clear();
  });

  it('should be OK with sibling', () => {
    const soup = JSSoup.parse('<a>hello</a><b>df</b><c>df</c>');
    expect(soup.contents[0].previousSibling).toEqual(undefined);
    expect(soup.contents[0].nextSibling.name).toMatch('b');
    expect(soup.contents[1].previousSibling.name).toMatch('a');
    expect(soup.contents[1].nextSibling.name).toMatch('c');
    expect(soup.contents[2].previousSibling.name).toMatch('b');
    expect(soup.contents[2].nextSibling).toEqual(undefined);
    soup.clear();
  });
});

describe('attrs', () => {
  it('should be OK', () => {
    const soup = JSSoup.parse('<a class="hi">hello</a>');
    expect(soup.contents[0].attrs).toBeDefined();
    soup.clear();
  });

  it('should be OK', () => {
    const soup = JSSoup.parse('<a class="h1 h2 h3">hello</a>');
    expect(soup.contents[0].attrs).toBeDefined();
		soup.clear();
  });
});


describe('extract', () => {
  it('should be OK', () => {
    const soup = JSSoup.parse('<a class="hi">hello</a>');
    const a = soup.contents[0];
    a.extract();
    expect(a.parent).toEqual(null);
    expect(soup.contents.length).toEqual(0);
		soup.clear();
  });

  it('should be OK with SoupString', () => {
    const soup = JSSoup.parse('<a class="hi">hello</a>');
    const text = soup.find(undefined, undefined, 'hello');

		text.extract();
    expect(soup.contents[0].nextElement).toEqual(null);
    expect(soup.descendants.length).toEqual(1);
    expect(soup.text).toMatch('');
    soup.clear();
  });

  it('should be OK', () => {
    const soup = JSSoup.parse('<a class="hi">1</a><b>2</b><c>3</c>');
    const a = soup.contents[0];
    const b = soup.contents[1];
    const c = soup.contents[2];
    const before = soup.descendants.length;
    a.extract();
    expect(soup.nextElement).toEqual(b);
    expect(soup).toEqual(b.previousElement);
    expect(b.nextElement.nextElement).toEqual(c);
    expect(before).toEqual(soup.descendants.length + 2);
    expect(a.nextElement.toString()).toEqual('1');
    expect(a.nextElement.nextElement).toEqual(null);
    soup.clear();
  });

  it('should be OK with no sub contents', () => {
    const soup = JSSoup.parse('<a class="hi"></a><b></b><c></c>');
    const a = soup.contents[0];
    const b = soup.contents[1];
    const c = soup.contents[2];
    const before = soup.descendants.length;
    b.extract();
    expect(soup.nextElement).toEqual(a);
    expect(soup).toEqual(a.previousElement);
    expect(a.nextElement).toEqual(c);
    expect(c.previousElement).toEqual(a);
    expect(before).toEqual(soup.descendants.length + 1);
    expect(a.nextElement.nextElement).toEqual(null);
    expect(b.nextElement).toEqual(null);
    expect(b.previousElement).toEqual(null);
    expect(b.parent).toEqual(null);
    soup.clear();
  });

  it('should be OK with combine function', () => {
    const soup = JSSoup.parse('<a class="hi">1</a><b>2</b><c>3</c>');
    const a = soup.contents[0];
    const b = soup.contents[1];
    const c = soup.contents[2];
    const before = soup.descendants.length;
    b.extract();
    expect(soup.text).toEqual('13');
    soup.append(b);
    expect(soup.text).toEqual('132');
    expect(before).toEqual(soup.descendants.length);
    expect(c.nextElement.nextElement).toEqual(b);
    expect(b.previousElement.previousElement).toEqual(c);
    soup.clear();
  });

});

describe('findAll', () => {
  it('should find all elements', () => {
    let soup = JSSoup.parse('<a>hello</a>');
    let ret = soup.findAll();
    expect(ret.length).toEqual(1);
    soup = JSSoup.parse(data);
    ret = soup.findAll();
    expect(ret.length).toEqual(11);
    ret = soup.findAll('a');
    expect(ret.length).toEqual(3);
    ret = soup.findAll('p');
    expect(ret.length).toEqual(3);
    ret = soup.findAll('head');
    expect(ret.length).toEqual(1);
    ret = soup.findAll('title');
    expect(ret.length).toEqual(1);
    ret = soup.findAll('');
    expect(ret.length).toEqual(0);
		soup.clear();
  });

  it('should be OK with only name as argument', () => {
    const soup = JSSoup.parse('<a>hello</a>');
    let ret = soup.findAll('a');
    expect(ret.length).toEqual(1);
    expect(ret[0].name).toEqual('a');
    ret = soup.findAll('b');
    expect(ret.length).toEqual(0);
    soup.clear();
  });

  it('should be OK with only string as argument', () => {
    let soup = JSSoup.parse('<a>hello</a>');
    let ret = soup.findAll(undefined, undefined, 'hello');
    expect(ret.length).toEqual(1);
    expect(ret[0].constructor.name).toEqual('SoupString');

    ret = soup.findAll('a', undefined, 'hello');
    expect(ret.length).toEqual(1);
    expect(ret[0].string.toString()).toMatch('hello');
    expect(ret[0].name).toMatch('a');

    soup = JSSoup.parse(data);
    ret = soup.findAll(undefined, undefined, '...');
    expect(ret.length).toEqual(1);
    expect(ret[0].toString()).toMatch('...');

    ret = soup.findAll('p', undefined, '...');
    expect(ret.length).toEqual(1);
    expect(ret[0].name).toEqual('p');
    expect(ret[0].string.toString()).toEqual('...');
    soup.clear();
  });

  it('should be OK with attributes', () => {
    const soup = JSSoup.parse(data);
    let ret = soup.findAll('p', 'title');
    expect(ret.length).toEqual(1);
    expect(ret[0].name).toEqual('p')
    const ret2 = soup.findAll('p', {class: 'title'});
    expect(ret2.length).toEqual(1);
    expect(ret[0]).toEqual(ret2[0]);
    ret = soup.findAll('p', 'story');
    expect(ret.length).toEqual(2);
    soup.clear();
  });
});

describe('prev next', () => {
  it('should be OK', (done) => {
    const soup = JSSoup.parse(data);

		let cur = soup;
    let last = null;

    while (cur) {
      last = cur;
      cur = cur.nextElement;
    }
    while (last) {
      last = last.previousElement;
    }
    soup.clear();
		done();
  });
});

describe('descendants', () => {
  it('should be OK', () => {
    const soup = JSSoup.parse(data);
    expect(soup.descendants.length).toEqual(21);

		let cur = soup.nextElement;
    for (let i of soup.descendants) {
      expect(i).toEqual(cur);
      cur = cur.nextElement;
    }
    soup.clear();
  });

  it('should be OK', () => {
    const soup = JSSoup.parse('<div><a></a><b></b></div>');
    const a = soup.nextElement.nextElement;
    expect(a.descendants.length).toEqual(0);
    soup.clear();
  });
});

describe('getText', () => {
  it('should be OK', () => {
    const soup = JSSoup.parse('<a>1<b>2</b>3</a>');
    expect(soup.getText()).toEqual('123');
    expect(soup.getText('|')).toEqual('1|2|3');
    expect(soup.getText()).toEqual(soup.text);
    soup.clear();
  });

  it('should be OK', () => {
    const soup = JSSoup.parse('<div><a>1<b>2</b>3</a><c>4</c></div>');
    expect(soup.getText()).toEqual('1234');
    expect(soup.getText('|')).toEqual('1|2|3|4');
    expect(soup.getText()).toEqual(soup.text);
    soup.clear();
  });
});

describe('prettify', () => {
  it('should be OK', () => {
    const soup = JSSoup.parse('<a>1<b>2</b>3</a>');
    expect(soup.nextElement.prettify()).toMatch('<a>\n 1\n <b>\n  2\n </b>\n 3\n</a>');
    soup.clear();
  });

  it('should be OK with attributes', () => {
    const soup = JSSoup.parse('<a class="h1 h2" id="h3 h4">1<b>2</b>3</a>');
    expect(soup.nextElement.prettify()).toEqual('<a class="h1 h2" id="h3 h4">\n 1\n <b>\n  2\n </b>\n 3\n</a>');
    soup.clear();
  });

  it('should be OK with indent argument', () => {
    const soup = JSSoup.parse('<a class="h1 h2" id="h3 h4">1<b>2</b>3</a>');
    expect(soup.nextElement.prettify('', '')).toEqual('<a class="h1 h2" id="h3 h4">1<b>2</b>3</a>');
    expect(soup.nextElement.prettify('\t', '')).toEqual('<a class="h1 h2" id="h3 h4">\t1\t<b>\t\t2\t</b>\t3</a>');
    expect(soup.nextElement.prettify('\t', ' ')).toEqual('<a class="h1 h2" id="h3 h4"> \t1 \t<b> \t\t2 \t</b> \t3 </a>');
    soup.clear();
  });
});

describe('append', () => {
  it('should be OK', () => {
    const soup = JSSoup.parse('<a class="h1 h2" id="h3 h4">1<b>2</b>3</a>');
    const text2 = soup.find(undefined, undefined, '2');
    expect(text2.toString()).toMatch('2');
    text2.extract();
    const b = soup.find('b');
    expect(b.contents.length).toEqual(0);
    expect(text2.parent).toEqual(null);
    const a = soup.find('a');
    a.append(text2);
    expect(b.nextSibling.toString()).toMatch('32');
    expect(b.nextSibling.nextSibling).toBeFalsy();
    expect(b.nextElement.toString()).toMatch('32');
    expect(b.nextElement.nextElement).toBeFalsy();
    soup.clear();
  });

  it('should be OK', () => {
    const soup = JSSoup.parse('<a class="h1 h2" id="h3 h4">1<b>2</b></a>');
    const text2 = soup.find(undefined, undefined, '2');
    expect(text2.toString()).toEqual('2');
    text2.extract();
    const b = soup.find('b');
    expect(b.contents.length).toEqual(0);
    expect(text2.parent).toBeFalsy();
    const a = soup.find('a');
    a.append(text2);
    expect(b.nextSibling.toString()).toMatch('2');
    expect(b.nextSibling.nextSibling).toBeFalsy();
    expect(b.nextElement.toString()).toMatch('2');
    expect(b.nextElement.nextElement).toBeFalsy();
    expect(text2.parent).toEqual(a);
    expect(text2.previousSibling).toEqual(b);
    expect(text2.previousElement).toEqual(b);
    expect(text2.nextSibling).toBeFalsy();
    expect(text2.nextElement).toBeFalsy();
    soup.clear();
  });

  it('should be OK', () => {
    const soup = JSSoup.parse('<a class="h1 h2" id="h3 h4">1<b>2</b><c>3</c></a>');
    const a = soup.find('a');
    const b = soup.find('b');
    const c = soup.find('c');
    b.extract();
    a.append(b);
    expect(c.nextSibling).toEqual(b);
    expect(c.nextSibling.nextSibling).toBeFalsy();
    expect(b.nextSibling).toBeFalsy();
    expect(c.nextElement.toString()).toMatch('3');
    expect(c.nextElement.nextElement).toEqual(b);
    expect(b.nextElement.toString()).toMatch('2');
    expect(b.nextElement.nextElement).toBeFalsy();
    expect(b.nextElement.previousElement).toEqual(b);
    expect(b.previousElement.toString()).toMatch('3');
    expect(b.parent).toEqual(a);
    soup.clear();
  });
});

describe('parse html contents', () => {
	it('should parse contents and return an array of strings', () => {
		const result = JSSoup.parseHtmlContents('<a class="h1 h2" id="h3 h4">1<b>2</b></a>');
		expect(result).toEqual(['1', '2']);
	});

	it('should parse contents to a single string', () => {
		const result = JSSoup.parseHtmlToString('<a class="h1 h2" id="h3 h4">1<b>2</b></a>');
		expect(result).toEqual('1 2');
	});
});
