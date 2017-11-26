'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SoupStrainer = function () {
  function SoupStrainer(name, attrs, string) {
    _classCallCheck(this, SoupStrainer);

    if (typeof attrs == 'string' || Array.isArray(attrs)) {
      attrs = { class: attrs };
    }
    this.name = name;
    this.attrs = attrs;
    this.string = string;
  }

  _createClass(SoupStrainer, [{
    key: 'match',
    value: function match(tag) {
      // match string
      if (this.name == undefined && this.attrs == undefined) {
        if (this.string) {
          if (this._matchName(tag.string, this.string)) return tag.string;else return null;
        }
        return tag;
      }
      // match tag name
      var match = this._matchName(tag.name, this.name);
      if (!match) return null;
      // match string
      match = this._matchName(tag.string, this.string);
      if (!match) return null;
      // match attributes
      if (_typeof(this.attrs) == 'object') {
        if (!this._isEmptyObject(this.attrs)) {
          var props = Object.getOwnPropertyNames(this.attrs);
          var found = false;
          for (var i = 0; i < props.length; ++i) {
            if (props[i] in tag.attrs && this._matchAttrs(tag.attrs[props[i]], this.attrs[props[i]])) {
              found = true;
              break;
            }
          }
          if (!found) return null;
        }
      }
      return tag;
    }
  }, {
    key: '_matchName',
    value: function _matchName(tagItem, name) {
      if (name == undefined || name == null) return true;
      // if name is an array, then tag match any item in this array is a match.
      if (Array.isArray(name)) {
        for (var i = 0; i < name.length; ++i) {
          var match = this._matchName(tagItem, name[i]);
          if (match) return true;
        }
        return false;
      }
      return tagItem == name;
    }
  }, {
    key: '_matchAttrs',
    value: function _matchAttrs(candidateAttrs, attrs) {
      if (typeof attrs == 'string') {
        attrs = [attrs];
      }
      if (typeof candidateAttrs == 'string') {
        candidateAttrs = [candidateAttrs];
      }
      for (var i = 0; i < candidateAttrs.length; ++i) {
        if (attrs.indexOf(candidateAttrs[i]) < 0) return false;
      }
      return true;
    }
  }, {
    key: '_isEmptyObject',
    value: function _isEmptyObject(obj) {
      return Object.keys(obj).length == 0;
    }
  }]);

  return SoupStrainer;
}();

exports.default = SoupStrainer;