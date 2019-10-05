import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.filter('suffix', function (value) {
  if (value == 1) {
    var suffix = 'st'
  } else if (value == 2) {
    var suffix = 'nd'
  } else if (value == 3) {
    var suffix = 'rd'
  } else {
    var suffix = 'th'
  }
  return suffix
})

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
