import { assert } from './common.js'
import { VNode } from './vnode.js';
export default class VTxet extends VNode {
  constructor(options, component) {
    assert(options)
    assert(options.el)
    assert(options.data)
    super(options.el, component)
    this._data = options.data;
  }
  render() {

  }
}