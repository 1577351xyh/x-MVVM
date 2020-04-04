import { assert } from './common.js'
import { VNode } from './vnode.js';
import { compileStringTemplate } from './exprsion.js'
export default class VText extends VNode {
  constructor(options, parent) {
    assert(options);
    assert(options.el);
    assert(options.data);

    super(options.el, parent);

    //
    this._template = options.data;
    this._last_str = undefined;

    this.status = 'init';
  }

  render() {
    let str = compileStringTemplate(this._template, this.$parent._proxy);
    if (this._last_str !== str) {
      this._el.data = str;
      this.status = 'update';
      this._last_str = str;
      console.log('[vtext rendered]', this.name);
    }
  }
}