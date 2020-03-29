import { assert } from "./common.js"
import { expr } from './exprsion.js'
import VElement from './velement.js'
/**
 * 指令
 * {name:'show',arg:undifined,value:'aaa}
 */
export default {
  // {name:'bind',arg:'title',value:'a'}
  bind(velement, directive) {
    assert(velement)
    assert(directive)
    let result = expr(directive.value, velement._component._data)
    velement._el.setAttribute(directive.arg, result)
  },
  // {name:'on',arg:'click',value:'fn(1,3)'}
  on(velement, directive) {
    // value => 'fn'
    // value => 'fn()'
    // value => 'fn(1,3)+sum(3,2)'
    velement._el.addEventListener(directive.arg, function () {
      let str = directive.value;
      //fn
      if(/^[\$_a-z][a-z0-9_\$]*$/i.test(str)){
        str += '()';
      }
      expr(str, velement._component._data)
    }, false)

  },
  // {name:'show',arg:'undefind',value: 'show'}
  show(velement, directive) {
    assert(velement)
    assert(directive)
    assert(directive instanceof VElement)

    let result = expr(directive.value, velement._component._data)
    if (result) {
      velement._el.style.display = ''
    } else {
      velement._el.style.display = 'none'
    }
  },
  // {name:'hmtl',arg:'undefind',value: 'show'}
  html() {
    assert(velement)
    assert(directive)
    assert(directive instanceof VElement)

    let result = expr(directive.value, velement._component._data)
    velement._el.innerHTML = result
  },
  text() {
    assert(velement);
    assert(velement instanceof VElement);
    assert(assert);
    assert(directive);
    assert(directive.value);

    let result = expr(directive.value, velement._component._data);
    let node = document.createTextNode(result);

    velement._el.innerHTML = '';
    velement._el.appendChild(node);
  },
  model() {

  },
  'if'() {

  },
  'else-if'() {

  },
}