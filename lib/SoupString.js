import SoupElement from './SoupElement';

class SoupString extends SoupElement {
  constructor(text, parent=null, previousElement=null, nextElement=null) {
    super(parent, previousElement, nextElement);
    this._text = text;
  }

	toString () {
		return this._text;
	}
}

export default SoupString;
