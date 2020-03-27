import { created } from './proxy.js';
import { parse } from './domparser.js'
import { assert, getElement } from './common.js'

// let a = {
//   a: 1,
//   b: 3,
//   c: 'aaaaa',
//   arr: [1, 2, 3],
//   obj: {
//     a: 3, h: 6, x: 99
//   }
// }

let dom = getElement('#app')

let res = parse(dom)
console.log(res)