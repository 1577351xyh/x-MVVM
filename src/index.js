import { created } from './proxy.js';

let a = {
  a: 1,
  b: 3,
  c: 'aaaaa',
  arr: [1, 2, 3],
  obj: {
    a: 3, h: 6, x: 99
  }
}
let res = created(a, () => {
  console.log('set触发')
})
console.log(res)