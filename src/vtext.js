import { assert } from './common.js'
import { VNode } from './vnode.js';
import { compileStringTemplate } from './exprsion.js'
export default class VText extends VNode{
  constructor(options, component){
    assert(options);
    assert(options.el);
    assert(options.data);

    super(options.el, component);

    //
    this._template=options.data;

    this.status='init';
  }

  render(){
    let str=compileStringTemplate(this._template, this._component._data);
    
    this._el.data=str;


    this.status='update';

  }
}