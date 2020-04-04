import VElement from './velement.js'
import Vue from './vue.js'
import VComponent from './vcomponet.js'
import VText from './vtext.js'
import { assert, dom } from './common.js'

// 创建虚拟dom数
export function createVDom(node, parent,component) {
  assert(node);
  assert(node._blue);
  assert(node.type == 'element' || node.type == 'text');

  if (node.type == 'element') {

    if (node.ishtml) {
      //VElement
      let ele = new VElement(node, parent);
      ele.$children = node.children.map(child => createVDom(child, ele,component));
      ele.$root =component;
      return ele
    } else {
      //VComponent
      let cmp = new VComponent(node, parent);
      cmp.$children = node.children.map(child => createVDom(child, cmp,cmp));
      // cmp.$root =cmp;

      return cmp
    }
  } else {
    //VText
    return new VText(node, parent);
  }
}
