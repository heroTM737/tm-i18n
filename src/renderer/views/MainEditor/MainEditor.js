import fs from 'fs'
import { mapState } from 'vuex'
import _ from 'lodash'
import ItemEditor from '@/views/ItemEditor'

export default {
  name: 'MainEditor',
  components: { ItemEditor },
  data () {
    return {
      treeData: [],
      list: [],
      listModel: [],
      search: '',
      id: null,
      buttonList: [],
      editingItem: null,
      contextMenuShow: false,
      x: 0,
      y: 0
    }
  },
  computed: {
    ...mapState({
      activeSource: state => state.activeSource
    })
  },
  methods: {
    initEditor () {
      if (this.activeSource) {
        let dir = fs.readdirSync(this.activeSource)
        let list = []
        let listModel = []
        for (let i in dir) {
          let fileContent = fs.readFileSync(this.activeSource + '/' + dir[i], 'utf8')
          list.push({
            name: dir[i],
            data: JSON.parse(fileContent)
          })
          listModel.push('')
        }
        this.list = list
        this.listModel = listModel
        this.buildTreeData()
        if (this.id) {
          this.itemClick([this.id])
          this.$forceUpdate()
        }
      }
    },
    buildTreeData () {
      let treeData = {}
      for (let i in this.list) {
        treeData = _.merge(treeData, this.buildTree(this.list[i].data, ''))
      }
      let treeDataList = []
      for (let i in treeData) {
        treeDataList.push(treeData[i])
      }

      this.treeData = treeDataList
    },
    buildTree (root, parentId) {
      let data = []
      for (let i in root) {
        let item = {
          id: parentId ? parentId + '.' + i : i,
          name: i
        }
        if (typeof root[i] === 'object') {
          item.children = this.buildTree(root[i], item.id)
        }
        data.push(item)
      }
      return data
    },
    itemClick (item) {
      if (item.length < 1) {
        return
      }
      let id = item[0]
      this.id = id
      let split = id.split('.')
      let buttonList = []
      buttonList[0] = split[split.length - 1]
      if (split.length > 1) {
        for (let i = split.length - 2; i >= 0; i--) {
          buttonList.unshift(split[i] + '.' + buttonList[0])
        }
      }

      this.buttonList = buttonList
      for (let i = 0; i < this.list.length; i++) {
        let root = this.list[i].data
        for (let key of split) {
          if (root[key]) {
            root = root[key]
          } else {
            root = ''
            break
          }
        }
        this.listModel[i] = root
      }
      this.$forceUpdate()
    },
    save () {
      let count = 0
      let split = this.id.split('.')
      for (let i = 0; i < this.list.length; i++) {
        let locale = this.list[i]
        let root = locale.data
        for (let j = 0; j < split.length - 1; j++) {
          root = root[split[j]]
        }
        root[split[split.length - 1]] = this.listModel[i]
        fs.writeFile(
          this.activeSource + '/' + locale.name,
          JSON.stringify(locale.data),
          error => {
            if (error) {
              console.error(error)
            }
            count++
            if (count === this.list.length) {
              this.initEditor()
            }
          }
        )
      }
    },
    editItem (item) {
      this.editingItem = item
      this.$refs.ItemEditor.open(item)
    },
    updateItem (item) {
      let split = this.editingItem.id.split('.')
      this.addItem(item, split[split.length - 1])
      this.deleteItem(this.editingItem)
      this.buildTreeData()
      let itemId = item.parent ? item.parent + '.' + item.name : item.name
      this.itemClick([itemId])
      this.$forceUpdate()
    },
    deleteItem (item) {
      let id = item.id
      let split = id.split('.')
      for (let root of this.list) {
        let rootItem = root.data
        let notFound = false
        for (let i = 0; i < split.length - 1; i++) {
          if (rootItem[split[i]] !== undefined) {
            rootItem = rootItem[split[i]]
          } else if (rootItem[split[i]] === null) {
            delete rootItem[split[i]]
            notFound = true
            break
          } else {
            notFound = true
            break
          }
        }
        if (!notFound) {
          delete rootItem[split[split.length - 1]]
        }
      }
    },
    addItem ({ parent, name }, cloneKey) {
      let split = parent.split('.')
      for (let root of this.list) {
        let rootItem = root.data
        if (parent) {
          for (let i = 0; i < split.length; i++) {
            if (rootItem[split[i]]) {
              rootItem = rootItem[split[i]]
            } else {
              console.log('parent not found')
              break
            }
          }
        }
        rootItem[name] = cloneKey ? rootItem[cloneKey] : ''
      }
    },
    showContextMenu (e) {
      e.preventDefault()
      this.contextMenuShow = true
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.contextMenuShow = true
      })
    }
  },
  watch: {
    activeSource: {
      immediate: true,
      handler:

        function () {
          this.initEditor()
        }
    }
  }
}
