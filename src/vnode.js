import { assert, uuid } from './common.js'

export class VNode {
  constructor(el, parent) {
    assert(el);
    assert(el instanceof Node);

    this.status = '';

    this._el = el;
    this.$parent = parent;
    this.name = uuid()
    console.log(this.name)
  }

  clone() {
    return new VNode(this._el.cloneNode(true), this.$parent);
  }

  render() {
    throw new Error('render method not defined');
  }
}