import { assert } from './common.js'
import VElement from './velement.js';

//自定义组件
export default class VComponent extends VElement{
  constructor(options, component){
    assert(options);
    super(options, component);

    //?
    this.status='init';
  }

  render(){
    this.status='update';

    //
  }
}