<template>
    <v-row no-gutters>
        <v-col cols="3">
            <div class="left">
                <v-text-field
                        label="Search"
                        v-model="search"
                        append-icon="mdi-search-web"
                ></v-text-field>
                <div class="tree-container">
                    <v-treeview
                            :search="search"
                            :items="treeData"
                            dense
                            hoverable
                            :activatable="true"
                            :open-on-click="true"
                            @update:active="itemClick"
                            active-class="active"
                            class="tree"
                    >
                    </v-treeview>
                </div>
            </div>
        </v-col>
        <v-col cols="9">
            <v-row justify="start">
                <div class="copy-btn mr-3" v-for="button in buttonList" :key="button">{{button}}</div>
            </v-row>
            <div v-for="(locale, index) in list" :key="locale.name">
                <v-text-field
                        :label="locale.name.split('.')[0]"
                        v-model="listModel[index]"
                ></v-text-field>
            </div>
        </v-col>
    </v-row>
</template>

<script>
import fs from 'fs'
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'MainEditor',
  data () {
    return {
      treeData: [],
      list: [],
      listModel: [],
      search: '',
      id: null,
      buttonList: []
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
        fs.readdir(this.activeSource, (error, dir) => {
          if (error) {
            console.error(error)
            return
          }
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
          let treeData = {}
          for (let i in dir) {
            treeData = _.merge(treeData, this.buildTree(list[i].data, ''))
          }
          let treeDataList = []
          for (let i in treeData) {
            treeDataList.push(treeData[i])
          }
          this.list = list
          this.listModel = listModel
          this.treeData = treeDataList
        })
      }
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
            break
          }
        }
        this.listModel[i] = root
      }
      this.$forceUpdate()
    }
  },
  watch: {
    activeSource: {
      immediate: true,
      handler: function () {
        this.initEditor()
      }
    }
  }
}
</script>

<style scoped lang="scss">
    .copy-btn {
        border-radius: 5px;
        width: fit-content;
        background: pink;
        padding: 5px;
    }

    .left {
        border-right: 1px solid #ccc;
        margin-right: 15px;
    }

    .tree-container {
        height: calc(100vh - 300px);
        overflow: auto;
    }

    .tree::v-deep .active {
        background: #c6c6c6;
    }
</style>
