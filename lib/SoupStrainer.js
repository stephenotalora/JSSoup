export default class SoupStrainer {
  constructor(name, attrs, string) {
    if (typeof attrs == 'string' || Array.isArray(attrs)) {
      attrs = {class: attrs};
    }
    this.name = name;
    this.attrs = attrs;
    this.string = string;
  }

  match(tag) {
    // match string
    if (this.name == undefined && this.attrs == undefined) {
      if (this.string) {
        if (this._matchName(tag.string, this.string))
          return tag.string;
        else
          return null;
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
    if (typeof this.attrs == 'object') {
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

  _matchName(tagItem, name) {
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

  _matchAttrs(candidateAttrs, attrs) {
    if (typeof attrs == 'string') {
      attrs = [attrs];
    }
    if (typeof candidateAttrs == 'string') {
      candidateAttrs = [candidateAttrs];
    }
    for (var i = 0; i < candidateAttrs.length; ++i) {
      if (attrs.indexOf(candidateAttrs[i]) < 0)
        return false;
    }
    return true;
  }

  _isEmptyObject(obj) {
    return Object.keys(obj).length == 0;
  }
}
