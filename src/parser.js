

/**
 *1.dom编译的内核 
 * @param {*} dom  
 */
import { assert } from './common.js'

export function parseDOM(dom) {
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
    let children = Array.from(dom.childNodes).map(child => parseDOM(child)).filter(child => child !== undefined)

    // 源生标签判断
    let isHtml = dom.constructor !== HTMLUnknownElement && dom.constructor !== HTMLElement;
    return {
      type: 'element',
      tag,
      el: dom,
      attrs,
      children,
      isHtml,
      _blue: true
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
        el: dom,
        data,
        _blue: true

      }
    } else {
      return undefined
    }

  }
}



/**
 *1.指令编译 bind @  
 * @param {*} dom  
 */
export function parseDirective(attrs) {
  assert(attrs)
  assert(attrs.constructor == Object)
  let directives = []

  for (let key in attrs) {
    let attrObj;

    if (key.startsWith('v-')) {
      let [name, arg] = key.split(':')
      attrObj = { name: name.replace(/^v\-/, ''), arg }

    } else if (key.startsWith(':')) {
      attrObj = { name: 'bind', arg: key.substring(1) }

    } else if (key.startsWith('@')) {
      attrObj = { name: 'on', arg: key.substring(1) }
    }

    if (attrObj) {
      assert(attrObj.name == 'bind' && attrObj.arg || attrObj.name != 'bind', 'not defind' + key)

      attrObj.meta = {}

      attrObj.value = attrs[key]
      directives.push(attrObj)
    }

  }
  return directives
}

/**
 * 1.过滤出事件
 * @param {*} directive 
 */

export function parseListeners(directive) {
  assert(directive)
  assert(directive instanceof Array)
  return directive.filter(directive => directive.name == 'on')
}