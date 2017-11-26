import SoupStrainer from './SoupStrainer';
import SoupElement from './SoupElement';
import SoupString from './SoupString';

class SoupTag extends SoupElement {
  constructor(name, attrs=null, parent=null, previousElement=null, nextElement=null) {
    super(parent, previousElement, nextElement);
    this.name = name;
    this.contents = []
    this.attrs = attrs || {}
  }

  _append(child) {
    if (child)
      this.contents.push(child);
  }

	_clear () {
		if (this.contents.length) this.contents = [];
	}

  /*
   * Build a soup object tree
   */
  _build(children) {
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
  _transfer (dom) {
    if (!dom) return null;
    if (dom.type === 'text') {
      return new SoupString(dom.data, this);
    } else if (dom.type === 'comment') {
      return new SoupComment(dom.data, this);
    } else {
      return new SoupTag(dom.name, dom.attribs, this);
    }
  }

  get string () {
    var cur = this;
    while (cur && cur.contents && cur.contents.length == 1) {
      cur = cur.contents[0];
    }
    if (!cur || cur instanceof SoupTag) return undefined;
    return cur;
  }

  find(name=undefined, attrs=undefined, string=undefined) {
    var r = this.findAll(name, attrs, string);
    if (r.length > 0) return r[0];
    return undefined;
  }

  /*
   * like find_all in BeautifulSoup
   */
  findAll (name=undefined, attrs=undefined, string=undefined) {
    var results = [];
    var strainer = new SoupStrainer(name, attrs, string);

    var descendants = this.descendants;
    for (var i = 0; i < descendants.length; ++i) {
      if (descendants[i] instanceof SoupTag) {
        var tag = strainer.match(descendants[i]);
        if (tag)
          results.push(tag);
      }
    }

    return results;
  }

  getText(separator='') {
    var text = [];
    var descendants = this.descendants;
    for (var i = 0; i < descendants.length; ++i) {
      if (descendants[i] instanceof SoupString) {
        text.push(descendants[i]._text);
      }
    }
    return text.join(separator);
  }

  get text() {
    return this.getText();
  }

  get descendants() {
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

  _convertAttrsToString() {
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

  _prettify(indent, breakline, level=0) {
    var text = '';
    var attrs = this._convertAttrsToString();
    if (attrs) {
      text += indent.repeat(level) + '<' + this.name + ' ' + attrs + '>' + breakline;
    } else {
      text += indent.repeat(level) + '<' + this.name + '>' + breakline;
    }

    for (var i = 0; i < this.contents.length; ++i) {
      if (this.contents[i] instanceof SoupString) {
        text += indent.repeat(level + 1) + this.contents[i].toString() + breakline;
      } else {
        text += this.contents[i]._prettify(indent, breakline, level + 1);
      }
    }
    text += indent.repeat(level) + '</' + this.name + '>' + breakline;
    return text;
  }

  prettify(indent=' ', breakline='\n') {
    return this._prettify(indent, breakline).trim();
  }

  /*
   * Append item in contents
   */
  append(item) {
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
    if (item instanceof SoupString && pre instanceof SoupString) {
      pre._text += item._text;
      return;
    }

    appendFirst.previousElement = pre;
    appendLast.nextElement = next;
    if (pre)
      pre.nextElement = appendFirst;
    if (next)
      next.previousElement = appendLast;

    this.contents.push(item);
    item.parent = this;
  }
}

SoupTag.prototype.toString = function() {
  return this.prettify('', '');
}

export default SoupTag;
