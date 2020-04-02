import Vue from './vue.js'

window.app = new Vue({
  el: '#app',
  data: {
    a: 3,
    c: 5,
    // show: true,
    arr: [1, 2, 4, 5, 6]
  },
  methods: {
    fn(ev) {
      this.a++
      console.log(ev)
    },
    fn2() {
      this.show = !this.show;
    }
  },
  // directives:{
  //   a:{
  //     init(){
  //       // console.log('我是啊')
  //     }
  //   }
  // },
  // created() {
  //   console.log('init完成')
  // },
  // updeted() {
  //   console.log('update完成')
  // }
})
console.log(app)