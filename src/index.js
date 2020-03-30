import Vue from './vue.js'

window.app = new Vue({
  el: '#app',
  data: {
    a: 3,
    c: 5
  },
  methods: {
    fn() {
      alert(1)
    }
  },
  created() {
    console.log('init完成')
  },
  updeted() {
    console.log('update完成')
  }
})
console.log(app)