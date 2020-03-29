import { assert } from "./common.js"
import { expr } from './exprsion.js'
/**
 * 指令
 * {name:'show',arg:undifined,value:'aaa}
 */
export default {
  bind(velement, directive) {
    assert(velement)
    assert(directive)
    let result = expr(directive.value, velement._component._data)
    velement._el.setAttribute(directive.arg,result)
  },
  model() {

  },
  on() {

  },
  show() {

  }
}