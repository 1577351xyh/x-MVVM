import { assert } from './common.js'
import { VNode } from './vnode.js';
import { parseDirective, parseListeners, parseDOM } from './parser.js'
import { createVDom } from './vdom.js';
import { createProxy } from './proxy.js'

export default class VElement extends VNode {
  constructor(options, parent) {
    assert(options);
    assert(options.el);
    assert(options.tag);
    assert(options.attrs);
    assert(options.children);

    super(options.el, parent);
    //
    this.type = options.tag;
    this.$attrs = options.attrs;
    this.$directives = parseDirective(options.attrs);
    this.$listeners = parseListeners(this.$directives);
    this.$options = options;

    // this._data=createProxy({}, component._data, ()=>{
    //   this.render();
    // });

    this._data = {}
    let _this = this
    this._proxy = new Proxy(this._data, {
      get(data, name) {
        return _this._get(name)
      },
      set(data, name, val) {
        _this[name] = val
        return true
      }
    })
  }
  _get(name) {
    let cur = this;
    while (cur) {
      if (cur._data[name] !== undefined) {
        return cur._data[name]
      }
      cur = cur.$parent
    }
  }
  _set(name, val) {
    this._data[name] = val
  }
  render() {
    //只渲染自己
    this._directive('update');

    //渲染子级
    this.$children.forEach(child => {
      child.render();
    });
    this.status = 'update';
  }

  _directive(type) {
    //再执行其他的
    doDirectives.call(this, this.$directives);
    function doDirectives(arr) {
      arr.forEach(directive => {
        let direcitveObj = this.$root._directives[directive.name];
        assert(direcitveObj, `no directive: ${directive.name}`);

        let dirFn = direcitveObj[type];
        if (dirFn) {
          assert(typeof dirFn == 'function');

          dirFn(this, directive);
        }
      });
    }
  }

  clone() {
    let element = parseDOM(this._el.cloneNode(true));
    delete element.attrs['v-for'];
    let tree = createVDom(element, this.$parent, this.$root);
    return tree;
  }
}