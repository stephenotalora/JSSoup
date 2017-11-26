'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SoupStrainer = require('./SoupStrainer');

var _SoupStrainer2 = _interopRequireDefault(_SoupStrainer);

var _SoupElement2 = require('./SoupElement');

var _SoupElement3 = _interopRequireDefault(_SoupElement2);

var _SoupString = require('./SoupString');

var _SoupString2 = _interopRequireDefault(_SoupString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SoupTag = function (_SoupElement) {
  _inherits(SoupTag, _SoupElement);

  function SoupTag(name) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var previousElement = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var nextElement = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, SoupTag);

    var _this = _possibleConstructorReturn(this, (SoupTag.__proto__ || Object.getPrototypeOf(SoupTag)).call(this, parent, previousElement, nextElement));

    _this.name = name;
    _this.contents = [];
    _this.attrs = attrs || {};
    return _this;
  }

  _createClass(SoupTag, [{
    key: '_append',
    value: function _append(child) {
      if (child) this.contents.push(child);
    }
  }, {
    key: '_clear',
    value: function _clear() {
      if (this.contents.length) this.contents = [];
    }

    /*
     * Build a soup object tree
     */

  }, {
    key: '_build',
    value: function _build(children) {
      if (!children || children.length < 1) return this;
      var last = this;
      for (var i = 0; i < children.length; ++i) {
        var ele = this._transfer(children[i]);
        last.nextElement = ele;
        ele.previousElement = last;
        if (ele instanceof SoupTag) {
          last = ele._build(children[i].children);
        } else {
          last = ele;
        }
        this._append(ele);
      }
      return last;
    }

    /*
     * It's a soup object factory
     * It consturcts a soup object from dom.
     */

  }, {
    key: '_transfer',
    value: function _transfer(dom) {
      if (!dom) return null;
      if (dom.type === 'text') {
        return new _SoupString2.default(dom.data, this);
      } else if (dom.type === 'comment') {
        return new SoupComment(dom.data, this);
      } else {
        return new SoupTag(dom.name, dom.attribs, this);
      }
    }
  }, {
    key: 'find',
    value: function find() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var string = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      var r = this.findAll(name, attrs, string);
      if (r.length > 0) return r[0];
      return undefined;
    }

    /*
     * like find_all in BeautifulSoup
     */

  }, {
    key: 'findAll',
    value: function findAll() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var string = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      var results = [];
      var strainer = new _SoupStrainer2.default(name, attrs, string);

      var descendants = this.descendants;
      for (var i = 0; i < descendants.length; ++i) {
        if (descendants[i] instanceof SoupTag) {
          var tag = strainer.match(descendants[i]);
          if (tag) results.push(tag);
        }
      }

      return results;
    }
  }, {
    key: 'getText',
    value: function getText() {
      var separator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var text = [];
      var descendants = this.descendants;
      for (var i = 0; i < descendants.length; ++i) {
        if (descendants[i] instanceof _SoupString2.default) {
          text.push(descendants[i]._text);
        }
      }
      return text.join(separator);
    }
  }, {
    key: '_convertAttrsToString',
    value: function _convertAttrsToString() {
      var text = '';
      if (!this.attrs) return text;
      for (var key in this.attrs) {
        if (Array.isArray(this.attrs[key])) {
          text += key + '="' + this.attrs[key].join(' ') + '" ';
        } else {
          text += key + '="' + this.attrs[key] + '" ';
        }
      }
      text = text.trim();
      return text;
    }
  }, {
    key: '_prettify',
    value: function _prettify(indent, breakline) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var text = '';
      var attrs = this._convertAttrsToString();
      if (attrs) {
        text += indent.repeat(level) + '<' + this.name + ' ' + attrs + '>' + breakline;
      } else {
        text += indent.repeat(level) + '<' + this.name + '>' + breakline;
      }

      for (var i = 0; i < this.contents.length; ++i) {
        if (this.contents[i] instanceof _SoupString2.default) {
          text += indent.repeat(level + 1) + this.contents[i].toString() + breakline;
        } else {
          text += this.contents[i]._prettify(indent, breakline, level + 1);
        }
      }
      text += indent.repeat(level) + '</' + this.name + '>' + breakline;
      return text;
    }
  }, {
    key: 'prettify',
    value: function prettify() {
      var indent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' ';
      var breakline = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\n';

      return this._prettify(indent, breakline).trim();
    }

    /*
     * Append item in contents
     */

  }, {
    key: 'append',
    value: function append(item) {
      var pre = this;
      var next = this.nextElement;
      var appendFirst = item;
      var appendLast = item;
      var itemDescendants = item.descendants;
      if (itemDescendants && itemDescendants.length > 0) {
        appendLast = itemDescendants[itemDescendants.length - 1];
      }
      var descendants = this.descendants;
      if (descendants && descendants.length > 0) {
        pre = descendants[descendants.length - 1];
        next = pre.nextElement;
      }

      //merge two SoupString
      if (item instanceof _SoupString2.default && pre instanceof _SoupString2.default) {
        pre._text += item._text;
        return;
      }

      appendFirst.previousElement = pre;
      appendLast.nextElement = next;
      if (pre) pre.nextElement = appendFirst;
      if (next) next.previousElement = appendLast;

      this.contents.push(item);
      item.parent = this;
    }
  }, {
    key: 'string',
    get: function get() {
      var cur = this;
      while (cur && cur.contents && cur.contents.length == 1) {
        cur = cur.contents[0];
      }
      if (!cur || cur instanceof SoupTag) return undefined;
      return cur;
    }
  }, {
    key: 'text',
    get: function get() {
      return this.getText();
    }
  }, {
    key: 'descendants',
    get: function get() {
      var ret = [];
      var cur = this.nextElement;
      while (cur) {
        var parent = cur.parent;
        while (parent && parent != this) {
          parent = parent.parent;
        }
        if (!parent) break;
        ret.push(cur);
        cur = cur.nextElement;
      }
      return ret;
    }
  }]);

  return SoupTag;
}(_SoupElement3.default);

SoupTag.prototype.toString = function () {
  return this.prettify('', '');
};

exports.default = SoupTag;