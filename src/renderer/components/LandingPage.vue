<template>
    <div id="wrapper">
        <div>
            <v-btn @click="readDir">Read Vuetify</v-btn>
        </div>
        <div>
            Pick folder
        </div>
        <div>
            <div v-for="(item, index) in recentList" :key="index" @click="readDir(index)">
                {{item}}
            </div>
        </div>
    </div>
</template>

<script>
import fs from 'fs'

export default {
  name: 'landing-page',
  data () {
    return {
      recentList: [
        'E:/Project/fptai-v4-console/frontend/src/locales'
      ]
    }
  },
  methods: {
    readDir (index) {
      let source = this.recentList[index]
      fs.readdir(source, (error, dir) => {
        if (error) {
          console.error(error)
          return
        }
        for (let fileName of dir) {
          let fileContent = fs.readFileSync(source + '/' + fileName, 'utf8')
          console.log(JSON.parse(fileContent))
        }
      })
    }
  }
}
</script>

<style>
</style>
