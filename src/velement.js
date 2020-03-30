import { assert } from './common.js'
import { VNode } from './vnode.js';
import { parseDirective, parseListeners } from './parser.js'
import directiveFn from './directive.js'

export default class VElment extends VNode {
  constructor(options, component) {
    assert(options)
    assert(options.el)
    assert(options.tag)
    assert(options.attrs)
    super(options.el, component)
    // console.log(options)
    // this._data = options.data;
    this.type = options.tag;
    this.$attrs = options.attrs;
    this.$directives = parseDirective(this.$attrs)
    this.$parseListeners = parseListeners(this.$directives)


    this.status = 'init'
    this._directive('init')

  }
  render() {
    this.status = 'update'
    // 渲染子集
    // this.$children
    //渲染自己
    this._directive('update')
  }
  _directive(type) {
    this.$directives.forEach(directive => {
      let dirObj = directiveFn[directive.name];
      assert(dirObj)
      let dirFn = dirObj[type]
      if (dirFn) {
        dirFn(this, directive)
      }
    })
  }
}