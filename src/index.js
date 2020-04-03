import Vue from './vue.js'

window.app = new Vue({
  el: '#app',
  data: {
    a: 3,
    arr: [12, 5,]
  },
  methods: {
    fn(ev) {
      this.a++
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