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
    /**
     * 还需要在节点中判断是不是自定义的标签或者是原生html标签
     * 1.加了 "-" 的自定义标签会被html认为是源生标签
     */
    let tag = dom.tagName.toLowerCase()
    let attrs = {}
    Array.from(dom.attributes).forEach(attr => {
      attrs[attr.name] = attr.value
    })
    console.log()
    let children = Array.from(dom.childNodes).map(child => parse(child)).filter(child => child !== undefined)

    // 源生标签判断
    let isHtml = dom.constructor !== HTMLUnknownElement && dom.constructor !== HTMLElement;
    return {
      type: 'element',
      tag,
      attrs,
      children,
      isHtml,
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
