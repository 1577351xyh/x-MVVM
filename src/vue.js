import VComponent from './vcomponet.js';
import { dom } from './common.js';
import { parseDOM } from './parser.js';
import { createVDom } from './vdom.js';
import { createProxy } from './proxy.js';
import directives from './directive.js';
import VElement from './velement.js';

export default class Vue {
  constructor(options) {
    //
    this._staticData = {
      ...options.methods,
    };
    this._data = createProxy(options.data, this._staticData, () => {
      this.forceUpdate();
    });


    this._directives = {
      ...directives,
      ...options.directives
    };

    //初始化——init
    let el = dom(options.el);
    let domTree = parseDOM(el);
    let vdomTree = createVDom(domTree, this,this);

    //
    this.created = options.created;
    this.updated = options.updated;

    this.root = vdomTree;
    // this._data=createProxy(options.data||{}, ()=>{
    // this._data=createProxy({...options.data, ...options.methods}, ()=>{
    //   this.render();
    // });

    function initElement(element) {
      element._directive('init')
      element.state = 'init'
      if (element.$children) {
        element.$children.forEach(vm => {
          if (vm instanceof VElement) {
            initElement(vm)
          }
        })
      }
    }

    initElement(this.root)

    this.status = 'init';
    this.created && this.created.call(this._data);

    this._render_timer=0
    //更新——update
    this.render();

    return this._data;
  }

  forceUpdate(){
    clearTimeout(this._render_timer)
    this._render_timer = setTimeout(()=>{
      this.render()
    },0)
  } 
  render() {
    //渲染自己
    this.root.render();
    this.status = 'update';
    this.updated && this.updated.call(this._data);
  }
}
