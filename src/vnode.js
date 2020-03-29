import { assert } from './common.js'

export class VNode {
  constructor(el, component) {
    assert(el)
    // assert(component)
    assert(el instanceof Node)
    this._component= component
    this._el = el;
  }
  render() {
    throw new Error('render is requier')
  }

}