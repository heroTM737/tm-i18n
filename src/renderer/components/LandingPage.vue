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
        {{test}}
    </div>
</template>

<script>
import { mapState } from 'vuex'

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
    }
  }
}
</script>

<style>
</style>
