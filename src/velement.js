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

    this.component =component
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

    //优先执行vmodel
    doDirective.call(this,this.$directives.filter(item => item.name == 'model'))
    doDirective.call(this,this.$directives.filter(item => item.name != 'model'))

    function doDirective(arr) {
      this.$directives
        .forEach(directive => {
          let dirObj = this.component._directives[directive.name];
          assert(dirObj)
          let dirFn = dirObj[type]
          if (dirFn) {
            dirFn(this, directive)
          }
        })
    }
  }
}