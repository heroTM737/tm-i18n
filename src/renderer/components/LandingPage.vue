<template>
    <div id="wrapper" class="pa-3">
        <div>
            <v-btn @click="pickSource">Pick a source</v-btn>
        </div>
        <div style="color: #fff" class="pt-5 pb-1">
            Recent source
        </div>
        <div v-for="(item, index) in recentList" :key="index" class="mb-3">
            <v-btn @click="readDir(index)" class="mr-3">
                {{item.name}}
            </v-btn>
            <span style="color: #fff" >{{item.src}}</span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import fs from 'fs'
import electron from 'electron'

export default {
    name: 'landing-page',
    data () {
        let recentList = null
        let fileName = 'recent.json'
        if (fs.existsSync(fileName)) {
            recentList = JSON.parse(fs.readFileSync(fileName, 'utf8'))
        } else {
            recentList = []
        }
        return {
            recentList: recentList
        }
    },
    computed: {
        ...mapState({
            test: state => state
        })
    },
    methods: {
        readDir (index) {
            this.$store.dispatch('activeSource', this.recentList[index].src)
            this.$nextTick(() => this.$router.push('/editor'))
        },
        pickSource () {
            let sources = electron.remote.dialog.showOpenDialog({
                properties: ['openDirectory']
            })
            if (sources) {
                this.$store.dispatch('activeSource', sources[0])
                this.$nextTick(() => this.$router.push('/editor'))
            }
        }
    }
}
</script>

<style>
</style>
