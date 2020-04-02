/**
 * 
 * 数据代理的内核
 * @param {*} data 需要绑定的数据
 * @param {*} cb 触发set后的回调
 */
import { assert } from './common.js'
export function createProxy(data, staticDate, cb) {
  assert(data, 'data is require')
  assert(cb, 'cb is require')
  let res;
  if (data instanceof Array) {
    res = []
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] == 'object') {
        res[i] = createProxy(data[i], staticDate, cb)
      } else {
        res[i] = data[i]
      }
    }
  } else {
    res = {}
    for (let key in data) {
      assert(!key.startsWith('$'), 'data key must not $')
      if (typeof data[key] == 'object') {
        res[key] = createProxy(data[key], staticDate, cb)
      } else {
        res[key] = data[key]
      }
    }
  }

  return new Proxy(res, {
    set(data, name, value) {
      if (typeof value == 'object') {
        data[name] = createProxy(value, staticDate, cb)
      } else {
        data[name] = value
      }
      cb(name)
      return true
    },
    get(data, name) {
      if (staticDate[name]) {
        return staticDate[name]
      } else {
        return data[name];
      }
    }
  })

}