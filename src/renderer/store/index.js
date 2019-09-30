import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

const state = {
  activeSource: ''
}

const mutations = {
  activeSource (state, payload) {
    state.activeSource = payload
  }
}

const actions = {
  activeSource (store, payload) {
    store.commit('activeSource', payload)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
  plugins: [
    createPersistedState()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
