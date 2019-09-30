import axios from 'axios'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import $const from '@/utils/const'

const base = axios.create({
  baseURL: `${process.env.VUE_APP_BASE_API_URL}`
})
base.interceptors.request.use(
  config => {
    config.headers = {
      Authorization: `Bearer ${VueCookies.get($const.TOKEN_KEY)}`
    }
    return config
  },
  err => Promise.reject(err)
)
base.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      VueCookies.remove($const.TOKEN_KEY)
      window.location.href = '/getting-started'
    }
    return Promise.reject(error)
  })
window.$http = base
Vue.prototype.$http = base
export default base
