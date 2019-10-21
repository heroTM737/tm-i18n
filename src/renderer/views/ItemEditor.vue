<template>
    <v-dialog v-model="show" width="650" persistent>
        <v-card>
            <v-card-title>Item Editor</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="submit">
                    <v-text-field
                            label="Parent"
                            v-model="parent"
                    ></v-text-field>
                    <v-text-field
                            label="Name"
                            v-model="name"
                    ></v-text-field>
                    <v-row justify="end" class="ma-0">
                        <v-btn @click="cancel" class="mr-3">Cancel</v-btn>
                        <v-btn type="submit" color="primary">Save</v-btn>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  name: 'ItemEditor',
  data () {
    return {
      show: false,
      name: null,
      parent: null
    }
  },
  methods: {
    open (item) {
      this.show = true
      this.name = item.name
      let lastIndexOfDot = item.id.lastIndexOf('.')
      if (lastIndexOfDot >= 0) {
        this.parent = item.id.substring(0, lastIndexOfDot)
      } else {
        this.parent = ''
      }
    },
    submit () {
      this.$emit('update', {
        name: this.name,
        parent: this.parent
      })
      this.show = false
    },
    cancel () {
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>
