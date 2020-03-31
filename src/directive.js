import { assert } from "./common.js"
import { expr } from './exprsion.js'
import VElement from './velement.js'
/**
 * 指令
 * {name:'show',arg:undifined,value:'aaa}
 */
export default {
  // {name:'bind',arg:'title',value:'a'}
  bind: {
    init: null,
    update(velement, directive) {
      assert(velement)
      assert(directive)
      let result = expr(directive.value, velement._component._data)
      velement._el.setAttribute(directive.arg, result)
      velement._el[directive.arg] = result;
    },
    destory: null

  },
  // {name:'on',arg:'click',value:'fn(1,3)'}
  on: {
    init(velement, directive) {
      // value => 'fn'
      // value => 'fn()'
      // value => 'fn(1,3)+sum(3,2)'
      console.log('监听')
      velement._el.addEventListener(directive.arg, function (ev) {
        let str = directive.value;
        //fn
        if (/^[\$_a-z][a-z0-9_\$]*$/i.test(str)) {
          str += '($event)';
        }
        velement._component._statiDate.$event = ev;
        expr(str, velement._component._data)
      }, false)
    },
    update: null,
    destory() {

    }

  },
  // {name:'show',arg:'undefind',value: 'show'}
  show: {
    init: null,
    update(velement, directive) {
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
    destory: null
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
  model: {
    init(velement, directive) {
      velement.$directives.push({ name: 'bind', arg: 'value', value: directive.value })
      velement.$directives.push({ name: 'on', arg: 'input', value: `${directive.value}=$event.target.value` })
    }
  },
  cloak: {
    update(velement, directive) {
      velement._el.removeAttribute('v-cloak')
    }
  },
  'if': {
    init(velement, directive) {
      let holder = document.createComment('vue holder');
      velement.__parent = velement._el.parentNode;
      velement.__holder = holder;
      velement.__el = velement._el;
    },
    update(velement, directive) {
      let res = expr(directive.value, velement._component._data);

      if (res) {
        if (velement.__holder.parentNode) {
          velement.__parent.replaceChild(velement.__el, velement.__holder);
        }
      } else {
        velement.__parent.replaceChild(velement.__holder, velement.__el);
      }
    },
    destory(velement, directive) { }
  },
  'else': {
    init(velement, directive) { },
    update(velement, directive) { },
    destory(velement, directive) { }
  },
  'else-if': {
    init(velement, directive) { },
    update(velement, directive) { },
    destory(velement, directive) { }
  },
  'for': {
    init(velement, directive) { },
    update(velement, directive) { },
    destory(velement, directive) { }
  }
}