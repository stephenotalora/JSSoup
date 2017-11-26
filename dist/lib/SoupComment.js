'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SoupElement2 = require('./SoupElement');

var _SoupElement3 = _interopRequireDefault(_SoupElement2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SoupComment = function (_SoupElement) {
  _inherits(SoupComment, _SoupElement);

  function SoupComment(text) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var previousElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var nextElement = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, SoupComment);

    var _this = _possibleConstructorReturn(this, (SoupComment.__proto__ || Object.getPrototypeOf(SoupComment)).call(this, parent, previousElement, nextElement));

    _this._text = text;
    return _this;
  }

  return SoupComment;
}(_SoupElement3.default);

exports.default = SoupComment;