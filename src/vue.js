import VComponent from './vcomponet.js';
import {dom} from './common.js';
import {parseDOM} from './parser.js';
import {createVDom} from './vdom.js';
import {createProxy} from './proxy.js';
import directives from './directive.js';

export default class Vue{
  constructor(options){
    //
    this._staticData={
      ...options.methods,
    };
    this._data=createProxy(options.data, this._staticData, ()=>{
      this.render();
    });


    this._directives={
      ...directives,
      ...options.directives
    };

    //初始化——init
    let el=dom(options.el);
    let domTree=parseDOM(el);
    let vdomTree=createVDom(domTree, this);

    //
    this.created=options.created;
    this.updated=options.updated;

    this.root=vdomTree;
    // this._data=createProxy(options.data||{}, ()=>{
    // this._data=createProxy({...options.data, ...options.methods}, ()=>{
    //   this.render();
    // });




    this.status='init';
    this.created && this.created.call(this._data);


    //更新——update
    this.render();

    return this._data;
  }

  render(){
    //渲染自己
    this.root.render();

    //渲染子级
    this.root.$children.forEach(child=>child.render());

    this.status='update';
    this.updated && this.updated.call(this._data);
  }
}
