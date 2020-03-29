import VComponent from './vcomponet.js'
import { assert, getElement } from './common.js'
import { createVDom } from './vdom.js'
import { parseDOM } from './parser.js'
import { createProxy } from './proxy.js'


export default class Vue {
  constructor(options, component) {
    assert(options);
    // super(options,null)
    let root = getElement(options.el)
    let domTree = parseDOM(root)
    let vdomTree = createVDom(domTree, this)

    // return vdomTree

    this._root = vdomTree;
    this._data = createProxy(options.data || {}, () => {
      this.render()
    })
    this.render()
  }
  render(){
    //渲染自己
    this._root.render()
    //渲染子集
    this._root.$children.forEach(element => {
        element.render()
    });

  }
}