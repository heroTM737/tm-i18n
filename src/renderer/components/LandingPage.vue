<template>
    <div id="wrapper" class="pa-3">
        <div>
            <v-btn @click="pickSource">Pick a source</v-btn>
        </div>
        <div style="color: #fff" class="pt-5 pb-1">
            Recent source
        </div>
        <div>
            <v-btn v-for="(item, index) in recentList" :key="index" @click="readDir(index)">
                {{item}}
            </v-btn>
        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex'

const electron = require('electron')
export default {
  name: 'landing-page',
  data () {
    return {
      recentList: [
        'src/locales'
      ]
    }
  },
  computed: {
    ...mapState({
      test: state => state
    })
  },
  methods: {
    readDir (index) {
      let source = this.recentList[index]
      this.$store.commit('activeSource', source)
      this.$nextTick(() => this.$router.push('/editor'))
    },
    pickSource () {
      let sources = electron.remote.dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      if (sources) {
        this.$store.commit('activeSource', sources[0])
        this.$nextTick(() => this.$router.push('/editor'))
      }
    }
  }
}
</script>

<style>
</style>
