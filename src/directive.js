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
      let result = expr(directive.value, velement._data)
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
      velement._el.addEventListener(directive.arg, function (ev) {
        let str = directive.value;
        //fn
        if (/^[\$_a-z][a-z0-9_\$]*$/i.test(str)) {
          str += '($event)';
        }
        velement._component._statiDate.$event = ev;
        expr(str, velement._data)
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

      let result = expr(directive.value, velement._data)
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

    let result = expr(directive.value, velement._data)
    velement._el.innerHTML = result
  },
  text() {
    assert(velement);
    assert(velement instanceof VElement);
    assert(assert);
    assert(directive);
    assert(directive.value);

    let result = expr(directive.value, velement._data);
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
      let res = expr(directive.value, velement._data);

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
    init(velement, directive) {
      let template = directive.meta.template = velement;
      let parentNode = directive.meta.parent = velement._el.parentNode
      let holder = directive.meta.holder = document.createComment('for holder')
      template._el.parentNode.replaceChild(holder, template._el)
      directive.meta.element = []
    },
    update(velement, directive) {
      const template = directive.meta.template;
      const parentNode = directive.meta.parent
      const holder = directive.meta.holder
      const element = directive.meta.element
      // item,index in arr 解析
      let { key, value, data } = parseFor(directive.value)
      let iter = expr(data, template._component._data)
      
      for (const i in iter) {
        let vel = directive.meta.template.clone();
        console.log(vel)
        element.push(vel)
        key && (vel._data[key] = i)
        vel._data[value] = iter[i]
        parentNode.insertBefore(vel._el, holder)
      }
      
      let _render = velement.render.bind(velement)
      velement.render = function (param) {
        element.forEach(vm => {
          vm.render()
        })
      }

    },
    destory(velement, directive) { }
  }
}


function parseFor(str) {
  let arr = str.split('in')
  let [value, key] = arr[0].split(',');
  return {
    key,
    value,
    data: arr[1]
  }
}