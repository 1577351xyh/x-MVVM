import { assert } from './common.js'

export class VNode {
  constructor(el, component) {
    assert(el)
    // assert(component)
    assert(el instanceof Node)
    this._component = component
    this.status = ''
    this._el = el;
  }
  clone() {
    return new VNode(this._el.cloneNode(true), this._component)
  }
  render() {
    throw new Error('render is requier')
  }

}