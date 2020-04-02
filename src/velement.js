import { assert } from './common.js'
import { VNode } from './vnode.js';
import { parseDirective, parseListeners, parseDOM } from './parser.js'
import { createVDom } from './vdom.js';
import { createProxy } from './proxy.js'

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
    this.$options = options
    this.$component = component
    this.$el = options.el
    this.status = 'init'
    this._directive('init')

    this._data = createProxy({}, component._data,()=>{
      this.render()
    })
    
  }
  render() {
    //渲染自己
    this._directive('update')
    // 渲染子集
    // this.$children
    this.status = 'update'

  }
  _directive(type) {

    //优先执行vmodel
    doDirective.call(this, this.$directives.filter(item => item.name === 'model'))
    doDirective.call(this, this.$directives.filter(item => item.name !== 'model'))

    function doDirective(arr) {
      arr.forEach(directive => {
        let dirObj = this.$component._directives[directive.name];
        assert(dirObj)
        let dirFn = dirObj[type]
        if (dirFn) {
          dirFn(this, directive)
        }
      })
    }
  }
  clone() {
    let element = parseDOM(this.$el.cloneNode(true))
    delete element.attrs['v-for']
    let tree = createVDom(element, this.$component)
    return tree


    //克隆一个velement
    // let node = super.clone()
    // node.type = this.type
    // node.$attrs = {};
    // for (const key in this.$attrs) {
    //   node.$attrs[key] = this.$attrs[key]
    // }
    // node.$directives = parseDirective(node.$attrs)
    // node.$parseListeners = parseListeners(node.$directives)
    // return node
  }
}