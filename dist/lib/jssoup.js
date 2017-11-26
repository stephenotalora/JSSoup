'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _htmlparser = require('htmlparser');

var _htmlparser2 = _interopRequireDefault(_htmlparser);

var _SoupTag2 = require('./SoupTag');

var _SoupTag3 = _interopRequireDefault(_SoupTag2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _JSSoup = null;
var ROOT_TAG_NAME = '[document]';

var JSSoup = function (_SoupTag) {
	_inherits(JSSoup, _SoupTag);

	function JSSoup(text) {
		_classCallCheck(this, JSSoup);

		var _this = _possibleConstructorReturn(this, (JSSoup.__proto__ || Object.getPrototypeOf(JSSoup)).call(this, ROOT_TAG_NAME, null));

		_this.parser = null;
		_this.handler = new _htmlparser2.default.DefaultHandler(function (error, dom) {
			if (error) throw error;
		}, { verbose: false, ignoreWhitespace: true });

		if (text) _this._initialize(text);
		return _this;
	}

	_createClass(JSSoup, [{
		key: '_initialize',
		value: function _initialize(text) {
			if (!this.parser) this.parser = new _htmlparser2.default.Parser(this.handler);

			this.parser.parseComplete(text);
			if (Array.isArray(this.handler.dom)) this._build(this.handler.dom);else this._build([this.handler.dom]);
		}
	}, {
		key: 'clear',
		value: function clear() {
			if (this.contents.length) _JSSoup._clear();
		}

		/**
   * parse
   * creates a soup singleton and initializes the soup collectionparses an html document and
   * @param  {String} text - containing an html document
   * @return {JSSoup} the soup collection
   */

	}], [{
		key: 'parse',
		value: function parse(text) {
			if (!_JSSoup) _JSSoup = new JSSoup();
			_JSSoup._initialize(text);
			return _JSSoup;
		}
	}, {
		key: 'parseHtmlContents',
		value: function parseHtmlContents(text) {
			var soup = JSSoup.parse(text);
			var result = (soup.getText(',') || '').split(',').map(function (item) {
				return item.trim();
			});
			soup.clear();
			return result;
		}
	}, {
		key: 'parseHtmlToString',
		value: function parseHtmlToString(text) {
			var contents = JSSoup.parseHtmlContents(text);
			return (contents || []).join(' ');
		}
	}, {
		key: 'purgeAll',
		value: function purgeAll() {
			_JSSoup.clear();
			_JSSoup = null;
		}
	}]);

	return JSSoup;
}(_SoupTag3.default);

exports.default = JSSoup;