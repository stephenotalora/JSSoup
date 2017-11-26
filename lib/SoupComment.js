import SoupElement from './SoupElement';

class SoupComment extends SoupElement {
  constructor(text, parent=null, previousElement=null, nextElement=null) {
    super(parent, previousElement, nextElement);
    this._text = text;
  }
}

export default SoupComment;
