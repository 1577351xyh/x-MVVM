import VComponent from './vcomponet.js'
import { assert, getElement } from './common.js'
import { createVDom } from './vdom.js'
import { parseDOM } from './parser.js'
import { createProxy } from './proxy.js'
import directives from './directive.js'

export default class Vue {
  constructor(options, component) {
    assert(options);
    this._directives = {
      ...directives,
      ...options.directives
    }
    // super(options,null)
    //初始化--init
    let root = getElement(options.el)
    let domTree = parseDOM(root)
    let vdomTree = createVDom(domTree, this)
    this.created = options.created;
    this.updeted = options.updeted;

    this._root = vdomTree;
    this._statiDate = {
      ...options.methods,
    }

    this._data = createProxy(options.data,this._statiDate || {}, () => {
      this.render()
    })
    
    this.status = 'init'
    this.created && this.created.call(this._data)
    //更新--update
    this.render()
    return this._data
  }
  render() {
    //渲染自己
    this._root.render()
    //渲染子集
    this._root.$children.forEach(element => {
      element.render()
    });
    this.status = 'update'
    console.log('update')
    this.updeted && this.updeted.call(this._data)
  }
}