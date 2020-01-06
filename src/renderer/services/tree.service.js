import fs from 'fs'
import formatJSON from 'format-json'
import store from '@/store/store'

const TreeService = {
    readDataFromId (root, id) {
        if (!id) {
            return root
        }
        let activeRoot = root
        let split = id.split('.')
        let i = 0
        for (i = 0; i < split.length; i++) {
            let property = split[i]
            if (activeRoot[property]) {
                activeRoot = activeRoot[property]
            } else {
                break
            }
        }
        return i === split.length ? activeRoot : ''
    },
    formatThenSaveFile (state) {
        let itemMap = state.itemMap
        let tree = state.tree

        let loopTree = (root, parentId, localeName) => {
            for (let i in root) {
                let id = parentId ? parentId + '.' + i : i
                if (typeof root[i] === 'object') {
                    root[i] = loopTree(root[i], id, localeName)
                } else {
                    root[i] = itemMap[id][localeName]
                }
            }
            return root
        }

        for (let locale of state.localeList) {
            let json = JSON.parse(JSON.stringify(tree))
            console.log(JSON.stringify(json))
            json = loopTree(json, '', locale.name)
            fs.writeFile(
                state.activeSource + '/' + locale.name,
                formatJSON.plain(json),
                error => {
                    if (error) {
                        console.error(error)
                    }
                }
            )
        }
    },
    checkItemExist (itemId) {
        if (!itemId) {
            return true
        }
        let split = itemId.split('.')
        let root = store.state.tree
        let found = true
        for (let name of split) {
            if (root[name]) {
                root = root[name]
            } else {
                found = false
                break
            }
        }
        return found
    },
    createItemId (parent, name) {
        return parent ? parent + '.' + name : name
    }
}

export default TreeService
