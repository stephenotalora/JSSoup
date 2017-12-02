const htmlparser = require('htmlparser');
import SoupTag from './SoupTag';

let _JSSoup = null;
const ROOT_TAG_NAME = '[document]';

export default class JSSoup extends SoupTag {
  constructor(text) {
    super(ROOT_TAG_NAME, null);

		this.parser = null;
		this.handler = new htmlparser.DefaultHandler(function (error, dom) {
			if (error) throw error;
		}, {verbose: false, ignoreWhitespace: true});

		if (text) this._initialize(text);
  }

	_initialize (text) {
		if (!this.parser) this.parser = new htmlparser.Parser(this.handler);

		this.parser.parseComplete(text);
		if (Array.isArray(this.handler.dom)) this._build(this.handler.dom);
    else this._build([this.handler.dom]);
	}

	clear () {
		if (this.contents.length) _JSSoup._clear();
	}

	/**
	 * parse
	 * creates a soup singleton and initializes the soup collectionparses an html document and
	 * @param  {String} text - containing an html document
	 * @return {JSSoup} the soup collection
	 */
	static parse (text) {
		if (!_JSSoup) _JSSoup = new JSSoup();
		_JSSoup._initialize(text);
		return _JSSoup;
	}

	static parseHtmlContents (text) {
		const soup = JSSoup.parse(text);
		const result = (soup.getText(',') || '').split(',').map((item) => item.trim());
		soup.clear();
		return result;
	}

	static parseHtmlToString (text) {
		const contents = JSSoup.parseHtmlContents(text);
		return (contents || []).join(' ');
	}

	static purgeAll () {
		_JSSoup.clear();
		_JSSoup = null;
	}
}
