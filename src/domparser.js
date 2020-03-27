/**
 *1.dom编译的内核 
 * @param {*} dom  
 */
import { assert, getElement } from './common.js'

export function parse(dom) {
  assert(dom, 'dom is requierd')
  assert(dom instanceof Node)
  /**
   * 1.标签
   * 2.属性
   * 3.children
   */
  //递归后会出现文本节点,文本节点就会报错

  if (dom.nodeType == document.ELEMENT_NODE) {
    let type = dom.tagName
    let attrs = {}
    Array.from(dom.attributes).forEach(attr => {
      attrs[attr.name] = attr.value
    })
    console.log()
    let children = Array.from(dom.childNodes).map(child => parse(child)).filter(child => child !== undefined)
    return {
      type,
      attrs,
      children
    }
  } else if (dom.nodeType == document.TEXT_NODE) {
    /**
    * 文本节点
    * 1.type:text
    * 2.data
    **/
    let data = dom.data.trim()
    if (data) {
      return {
        type: 'text',
        data,
      }
    } else {
      return undefined
    }

  }
}
