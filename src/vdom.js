import VElement from './velement.js'
import Vue from './vue.js'
import VComponent from './vcomponet.js'
import VText from './vtext.js'
import { assert, dom } from './common.js'

// 创建虚拟dom数
export function createVDom(node, component, parent){
  assert(node);
  assert(node._blue);
  assert(node.type=='element' || node.type=='text');
  assert(component);
  assert(component instanceof VComponent || component instanceof Vue);

  if(node.type=='element'){
    let parent;

    if(node.ishtml){
      //VElement
      parent=new VElement(node, component);
    }else{
      //VComponent
      parent=new VComponent(node, component);
    }

    //
    parent.$children=node.children.map(child=>createVDom(child, component, parent));

    return parent;
  }else{
    //VText
    return new VText(node, parent);
  }
}
