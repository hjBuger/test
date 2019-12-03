import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//集成element-ui
import './plugins/element.js'
//集成axios
import './plugins/axios'
//全局组件注册
import './components/global'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
