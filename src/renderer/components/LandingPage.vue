<template>
    <div id="wrapper" class="pa-3">
        <div>
            Pick a source
        </div>
        <div>
            <v-btn v-for="(item, index) in recentList" :key="index" @click="readDir(index)">
                {{item}}
            </v-btn>
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
