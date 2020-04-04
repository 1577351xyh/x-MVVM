import { assert } from "./common.js"
import { expr } from './exprsion.js'
import VElement from './velement.js'

/**
 * 指令
 * {name:'show',arg:undifined,value:'aaa}
 */
export default {
  //{name: "bind", arg: 'title', value: "a+b"}
  bind: {
    init: null,
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(assert);
      assert(directive);
      assert(directive.arg);
      assert(directive.value);

      let result = expr(directive.value, velement._proxy);
      if (directive.meta._last_data != result) {
        velement._el.setAttribute(directive.arg, result);
        velement._el['directive.arg'] = result;
        directive.meta._last_data = result;
        console.log('[velement rendered]', velement.name);
      }
    },
    destory: null,
  },

  //{name: "on", arg: 'click', value: "a+b"}
  on: {
    init(velement, directive) {
      //TODO
      velement._el.addEventListener(directive.arg, function (ev) {
        let str = directive.value;
        if (/^[\$_a-z][a-z0-9_\$]*$/i.test(str)) {
          str += '($event)';    //?
        }

        //velement._component._data.$event=ev;
        velement._component._staticData.$event = ev;
        expr(str, velement._data);
      }, false);
    },
    update: null,
    destory() {

    }
  },

  //{name: "model", arg: undefined, value: "a"}
  model: {
    init(velement, directive) {
      velement.$directives.push({ name: "bind", arg: 'value', value: directive.value });
      velement.$directives.push({ name: "on", arg: 'input', value: `${directive.value}=$event.target.value` });
    }
  },
  cloak: {
    update(velement) {
      velement._el.removeAttribute('v-cloak');
    }
  },
  //{name: "show", arg: undefined, value: "show"}
  show: {
    init: null,
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(assert);
      assert(directive);
      assert(directive.value);

      let result = expr(directive.value, velement._data);

      if (result) {
        velement._el.style.display = '';
      } else {
        velement._el.style.display = 'none';
      }
    },
    destory: null,
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
  'else-if': {
    init(velement, directive) { },
    update(velement, directive) { },
    destory(velement, directive) { }
  },
  'else': {
    init(velement, directive) { },
    update(velement, directive) { },
    destory(velement, directive) { }
  },
  'for': {
    init(velement, directive) {
      velement.$directives = velement.$directives.filter(item => item != directive);

      let template = directive.meta.template = velement;
      let parentNode = directive.meta.parent = velement._el.parentNode;

      let holder = directive.meta.holder = document.createComment('for holder');
      parentNode.replaceChild(holder, template._el);

      directive.meta.elements = [];

      //
      velement.render = function () {
        const template = directive.meta.template;
        const parentNode = directive.meta.parent;
        const holder = directive.meta.holder;
        const elements = directive.meta.elements;

        //删除掉   ?
        elements.forEach(element => {
          parentNode.removeChild(element._el);
        });
        elements.length = 0;

        //
        let { key, value, data } = parseFor(directive.value);

        let iter = expr(data, velement._proxy);
        for (let i in iter) {
          let vel = template.clone();
          elements.push(vel);
          // key && (vel._data[key]=i);
          // vel._data[value]=iter[i];

          key && vel._set(key, i)
          vel._set(value, iter[i])

          parentNode.insertBefore(vel._el, holder);
        }

        elements.forEach(velement => {

          velement.render();
        });
      };
    },
    update(velement, directive) {

    },
    destory(velement, directive) { }
  },
  //{name: "show", arg: undefined, value: "show"}
  html: {
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(assert);
      assert(directive);
      assert(directive.value);

      let result = expr(directive.value, velement._data);
      velement._el.innerHTML = result;
    }
  },
  text: {
    update(velement, directive) {
      assert(velement);
      assert(velement instanceof VElement);
      assert(assert);
      assert(directive);
      assert(directive.value);

      let result = expr(directive.value, velement._data);
      let node = document.createTextNode(result);

      velement._el.innerHTML = '';
      velement._el.appendChild(node);
    }
  }
};

function parseFor(str) {
  //str=>'xxx in xxx'
  //str=>'xxx,xx in xx'

  let arr = str.split(' in ');
  let [value, key] = arr[0].split(',');

  return {
    key,
    value,
    data: arr[1]
  };
}