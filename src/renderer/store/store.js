import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'

import fs from 'fs'
import _ from 'lodash'
import TreeService from '@/services/tree.service'
import sortObject from 'sort-object-keys'

Vue.use(Vuex)

const state = {
    activeSource: '',
    localeList: null,
    tree: null,
    itemMap: {},
    activeItem: {},
    forceUpdate: true
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
    },
    updateItemValue (state, item) {
        state.itemMap[item.id] = item
        TreeService.formatThenSaveFile(state)
    },
    addItem (state, itemId) {
        let split = itemId.split('.')
        let root = state.tree
        for (let i = 0; i < split.length - 1; i++) {
            let name = split[i]
            if (root[name]) {
                root = root[name]
            } else {
                root[name] = {}
            }
        }
        root[split[split.length - 1]] = itemId
        let item = { id: itemId }
        for (let locale of state.localeList) {
            item[locale.name] = ''
        }
        state.itemMap[itemId] = item
        state.activeItem = item
        state.forceUpdate = !state.forceUpdate
    },
    addFolder (state, itemId) {
        let split = itemId.split('.')
        let root = state.tree
        for (let i = 0; i < split.length; i++) {
            let name = split[i]
            if (root[name]) {
                root = root[name]
            } else {
                root[name] = {}
            }
        }
        state.forceUpdate = !state.forceUpdate
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
                        root[i] = loopTree(root[i], id)
                    } else {
                        itemMap[id] = { id }
                        for (let locale of localeList) {
                            itemMap[id][locale.name] = TreeService.readDataFromId(locale.data, id)
                        }
                    }
                }
                root = sortObject(root)
                return root
            }
            tree = loopTree(tree, '')

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
    },
    updateItemValue (store, item) {
        store.commit('updateItemValue', item)
        store.dispatch('activeItemId', store.state.activeItem.id)
    },
    addItem (store, data) {
        store.commit('addItem', data.id)
    },
    addFolder (store, data) {
        store.commit('addFolder', data.id)
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
