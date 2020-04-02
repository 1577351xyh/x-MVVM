import VElement from './velement.js'
import Vue from './vue.js'
import VComponents from './vcomponet.js'
import VText from './vtext.js'
import { assert, getElement } from './common.js'

// 创建虚拟dom数
export function createVDom(node, component,parent) {
  assert(node)
  assert(node._blue)
  assert(component)
  assert(component instanceof VComponents || component instanceof Vue)
  assert(node.type == 'element' || node.type == 'text')
  if (node.type === 'element') {
    let parse;
    if (node.isHtml) {
      //元素节点
      parse = new VElement(node, component)
    } else {
      //自定义组件
      parse = new VComponents(node, component)
    }
    parse.$children = node.children.map(child => createVDom(child, component ,parse))
    return parse;
  } else if (node.type == 'text') {
    //文本节点
    return new VText(node, parent)
  }
}