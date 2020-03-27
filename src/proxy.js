/**
 * 
 * 数据代理的内核
 * @param {*} data 需要绑定的数据
 * @param {*} cb 触发set后的回调
 */
import { assert } from './common.js'
export function created(data, cb) {
  assert(data, 'data is require')
  assert(cb, 'cb is require')
  let res;
  if (data instanceof Array) {
    res = []
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] == 'object') {
        res[i] = created(data[i], cb)
      } else {
        res[i] = data[i]
      }
    }
  } else {
    res = {}
    for (let key in data) {
      if (typeof data[key] == 'object') {
        res[key] = created(data[key], cb)
      } else {
        res[key] = data[key]
      }
    }
  }
  return new Proxy(res, {
    set(data, name, value) {
      data[name] = value
      cb(name)
      return true
    },
    get(data, name) {
      assert(name in data)
      return data[name];
    }
  })
}