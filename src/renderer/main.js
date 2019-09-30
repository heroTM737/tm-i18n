import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
// plugins
import i18n from './plugins/i18n'
// import './plugins/axios'
import './plugins/vuetify'
import './plugins/vue-notification'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
