import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
// plugins
import i18n from './plugins/i18n'
import vuetify from './plugins/vuetify'
import './plugins/vue-notification'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
Vue.config.silent = true

/* eslint-disable no-new */
new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
