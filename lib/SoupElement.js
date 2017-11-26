export default class SoupElement {
  constructor(parent=null, previousElement=null, nextElement=null) {
    this.parent = parent;
    this.previousElement = previousElement;
    this.nextElement = nextElement;
  }

  get nextSibling () {
    if (!this.parent) return undefined;
    var index = this.parent.contents.indexOf(this);
    if (index == this.parent.contents.length - 1) return undefined;
    return this.parent.contents[index + 1];
  }

  get previousSibling () {
    if (!this.parent) return undefined;
    var index = this.parent.contents.indexOf(this);
    if (index == 0) return undefined;
    return this.parent.contents[index - 1];
  }

  // remove item from dom tree
  extract() {
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
}
