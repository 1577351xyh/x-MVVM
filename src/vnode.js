import { assert } from './common.js'

export class VNode {
  constructor(el, component) {
    assert(el);
    assert(el instanceof Node);
    assert(component);  //?

    this.status = '';

    this._el = el;
    this._component = component;
  }

  clone() {
    return new VNode(this._el.cloneNode(true), this._component);
  }

  render() {
    throw new Error('render method not defined');
  }
}