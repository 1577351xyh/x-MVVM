import { assert } from './common.js'
import { VNode } from './vnode.js';
import { parseDirective, parseListeners, parseDOM } from './parser.js'
import { createVDom } from './vdom.js';
import { createProxy } from './proxy.js'

export default class VElement extends VNode{
  constructor(options, component){
    assert(options);
    assert(options.el);
    assert(options.tag);
    assert(options.attrs);
    assert(options.children);

    super(options.el, component);

    //
    this.type=options.tag;
    this.$attrs=options.attrs;
    this.$directives=parseDirective(options.attrs);
    this.$listeners=parseListeners(this.$directives);
    this.$options=options;

    //
    this._directive('init');
    this.state='init';

    //
    this._data=createProxy({}, component._data, ()=>{
      this.render();
    });
  }

  render(){
    //只渲染自己
    this._directive('update');

    //渲染子级
    this.$children.forEach(child=>{
      child.render();
    });


    this.status='update';
  }

  _directive(type){
    //优先执行v-model
    doDirectives.call(this, this.$directives.filter(directive=>directive.name=='model'));

    //再执行其他的
    doDirectives.call(this, this.$directives.filter(directive=>directive.name!='model'));





    function doDirectives(arr){
      arr.forEach(directive=>{
        let direcitveObj=this._component._directives[directive.name];
        assert(direcitveObj, `no directive: ${directive.name}`);

        let dirFn=direcitveObj[type];
        if(dirFn){
          assert(typeof dirFn=='function');

          dirFn(this, directive);
        }
      });
    }

  }

  clone(){
    // let node=super.clone();
    //
    // node.type=this.type;
    // node.$attrs={};
    // for(let key in this.$attrs){
    //   node.$attrs[key]=this.$attrs[key];
    // }
    //
    // node.$directives=parseDirective(node.$attrs);
    // this.$listeners=parseListeners(node.$directives);
    //
    // return node;

    let element=parseDOM(this._el.cloneNode(true));
    delete element.attrs['v-for'];
    let tree=createVDom(element, this._component);
    console.log(tree)
    return tree;
  }
}