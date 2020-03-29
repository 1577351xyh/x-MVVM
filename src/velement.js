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
  }
  render(){
    //只渲染指令
    this.$directives.forEach(directive=>{
      let dirFn = directiveFn[directive.name];
      dirFn(this,directive)
    })
    // this._el

    // this.$children
  }
}