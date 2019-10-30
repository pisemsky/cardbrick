import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

Vue.filter('suffix', function (value) {
  if (value == 1) {
    return 'st'
  } else if (value == 2) {
    return 'nd'
  } else if (value == 3) {
    return 'rd'
  } else {
    return 'th'
  }
})

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
