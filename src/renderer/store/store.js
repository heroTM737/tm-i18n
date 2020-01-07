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
    lastUpdate: new Date().getMilliseconds()
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
    activeItemId (state, payload) {
        state.activeItem = state.itemMap[payload]
    },
    updateItemValue (state, item) {
        state.itemMap[item.id] = item
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
            if (locale.name.includes('en')) {
                item[locale.name] = TreeService.convertIdToValue(itemId)
            } else {
                item[locale.name] = ''
            }
        }

        let loopTree = (root, parentId) => {
            for (let i in root) {
                let id = TreeService.createItemId(parentId, i)
                if (typeof root[i] === 'object') {
                    root[i] = loopTree(root[i], id)
                }
            }
            root = sortObject(root)
            return root
        }
        state.tree = loopTree(state.tree)

        state.itemMap[itemId] = item
        state.activeItem = item
        state.lastUpdate = new Date().getMilliseconds()
    },
    copyItem (state, { oldItemId, newItemId }) {
        let oldItem = state.itemMap[oldItemId]
        let newItem = state.itemMap[newItemId]
        for (let i in oldItem) {
            newItem[i] = oldItem[i]
        }
        newItem.id = newItemId
    },
    deleteItem (state, itemId) {
        let split = itemId.split('.')
        let root = state.tree
        for (let i = 0; i < split.length - 1; i++) {
            root = root[split[i]]
        }
        delete root[split[split.length - 1]]
        delete state.itemMap[itemId]
        state.lastUpdate = new Date().getMilliseconds()
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
        state.lastUpdate = new Date().getMilliseconds()
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
        store.commit('activeItemId', itemId)
    },
    updateItemValue (store, item) {
        store.commit('updateItemValue', item)
        store.dispatch('activeItemId', store.state.activeItem.id)
        TreeService.formatThenSaveFile(store.state)
    },
    addItem (store, data) {
        store.commit('addItem', data.id)
        TreeService.formatThenSaveFile(store.state)
    },
    updateItem (store, { oldItemId, id: newItemId }) {
        store.commit('addItem', newItemId)
        store.commit('copyItem', { oldItemId, newItemId })
        store.commit('deleteItem', oldItemId)
        store.commit('activeItemId', newItemId)
        TreeService.formatThenSaveFile(store.state)
    },
    deleteItem (store, itemId) {
        store.commit('deleteItem', itemId)
        TreeService.formatThenSaveFile(store.state)
    },
    addFolder (store, data) {
        store.commit('addFolder', data.id)
        TreeService.formatThenSaveFile(store.state)
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
