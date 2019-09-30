<template>
    <v-row no-gutters>
        <v-col cols="3">
            <v-text-field
                label="Search"
                v-model="search"
                append-icon="mdi-search-web"
            ></v-text-field>
            <v-treeview
                :items="filterTreeData"
                dense
                hoverable
            ></v-treeview>
        </v-col>
        <v-col cols="9">
            editor here
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
      search: ''
    }
  },
  computed: {
    ...mapState({
      activeSource: state => state.activeSource
    }),
    filterTreeData () {
      let slc = this.search.toLowerCase()
      return _.filter(this.treeData, item => item.name.toLowerCase().includes(slc))
    }
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
          for (let i in dir) {
            let fileContent = fs.readFileSync(this.activeSource + '/' + dir[i], 'utf8')
            list.push(JSON.parse(fileContent))
          }
          this.treeData = this.buildTree(list[0], '')
        })
      }
    },
    buildTree (root, parentId) {
      let data = []
      for (let i in root) {
        let item = {
          id: parentId + '.' + i,
          name: i
        }
        if (typeof root[i] === 'object') {
          item.children = this.buildTree(root[i], item.id)
        }
        data.push(item)
      }
      return data
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

<style scoped>

</style>
