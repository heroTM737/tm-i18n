import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'

import fs from 'fs'
import _ from 'lodash'
import TreeService from '@/services/tree.service'

Vue.use(Vuex)

const state = {
    activeSource: '',
    localeList: null,
    tree: null,
    itemMap: {},
    activeItem: {}
}

const mutations = {
    activeSource (state, payload) {
        state.activeSource = payload
    },
    localeList (state, payload) {
        state.localeList = payload
    },
    tree (state, payload) {
        state.tree = payload
    },
    itemMap (state, payload) {
        state.itemMap = payload
    },
    activeItem (state, payload) {
        state.activeItem = payload
    }
}

const actions = {
    activeSource (store, activeSource) {
        if (activeSource) {
            let dir = fs.readdirSync(activeSource)
            let localeList = []
            let tree = {}
            for (let i in dir) {
                let fileContent = fs.readFileSync(activeSource + '/' + dir[i], 'utf8')
                let localeData = JSON.parse(fileContent)
                localeList.push({
                    name: dir[i],
                    data: localeData
                })
                tree = _.merge(tree, localeData)
            }

            let itemMap = {}
            let loopTree = (root, parentId) => {
                for (let i in root) {
                    let id = parentId ? parentId + '.' + i : i
                    if (typeof root[i] === 'object') {
                        loopTree(root[i], id)
                    } else {
                        itemMap[id] = { id }
                        for (let locale of localeList) {
                            itemMap[id][locale.name] = TreeService.readDataFromId(locale.data, id)
                        }
                    }
                }
            }
            loopTree(tree, '')

            store.commit('activeSource', activeSource)
            store.commit('localeList', localeList)
            store.commit('tree', tree)
            store.commit('itemMap', itemMap)
        }
    },
    activeItemId (store, itemId) {
        let item = store.state.itemMap[itemId]
        if (item) {
            store.commit('activeItem', item)
        }
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters: {},
    plugins: [
        createPersistedState()
    ],
    strict: process.env.NODE_ENV !== 'production'
})
