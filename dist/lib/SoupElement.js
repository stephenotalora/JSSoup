"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SoupElement = function () {
  function SoupElement() {
    var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var previousElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var nextElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, SoupElement);

    this.parent = parent;
    this.previousElement = previousElement;
    this.nextElement = nextElement;
  }

  _createClass(SoupElement, [{
    key: "extract",


    // remove item from dom tree
    value: function extract() {
      var extractFirst = this;
      var extractLast = this;
      var descendants = this.descendants;
      if (descendants && descendants.length) {
        extractLast = descendants[descendants.length - 1];
      }
      // these two maybe null
      var before = this.previousElement;
      var after = extractLast.nextElement;
      // modify extract subtree
      extractFirst.previousElement = null;
      extractLast.nextElement = null;
      if (before) {
        before.nextElement = after;
      }
      if (after) {
        after.previousElement = before;
      }
      //remove node from contents array
      if (this.parent) {
        var index = this.parent.contents.indexOf(this);
        if (index >= 0) {
          this.parent.contents.splice(index, 1);
        }
      }
      this.parent = null;
    }
  }, {
    key: "nextSibling",
    get: function get() {
      if (!this.parent) return undefined;
      var index = this.parent.contents.indexOf(this);
      if (index == this.parent.contents.length - 1) return undefined;
      return this.parent.contents[index + 1];
    }
  }, {
    key: "previousSibling",
    get: function get() {
      if (!this.parent) return undefined;
      var index = this.parent.contents.indexOf(this);
      if (index == 0) return undefined;
      return this.parent.contents[index - 1];
    }
  }]);

  return SoupElement;
}();

exports.default = SoupElement;