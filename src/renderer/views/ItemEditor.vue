<template>
    <v-dialog v-model="show" width="650" persistent>
        <v-card>
            <v-card-title>{{isFolder ? 'Folder' : 'Item'}} Editor</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="submit">
                    <v-text-field
                            label="Parent"
                            v-model="parent"
                    ></v-text-field>
                    <v-text-field
                            label="Name"
                            v-model="name"
                            :error-messages="nameExistMessage"
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
  props: {
    checkExist: Function
  },
  data () {
    return {
      show: false,
      name: null,
      nameExistMessage: '',
      parent: null,
      isAdd: false,
      isFolder: false
    }
  },
  methods: {
    open (item, isFolder) {
      if (item) {
        this.isAdd = false
        this.name = item.name
        let lastIndexOfDot = item.id.lastIndexOf('.')
        if (lastIndexOfDot >= 0) {
          this.parent = item.id.substring(0, lastIndexOfDot)
        } else {
          this.parent = ''
        }
      } else {
        this.isAdd = true
        this.name = ''
        this.parent = ''
        this.isFolder = !!isFolder
      }
      this.show = true
    },
    submit () {
      let item = {
        name: this.name,
        parent: this.parent
      }
      this.$emit('update', item, this.isAdd, this.isFolder)
      this.show = false
    },
    cancel () {
      this.show = false
    }
  },
  watch: {
    name (val) {
      let name = val.trim()
      if (!name) {
        return
      }
      if (name.includes(' ')) {
        this.nameExistMessage = 'Name should not contain space'
        return
      } else {
        this.nameExistMessage = ''
      }
      if (this.checkExist) {
        if (this.checkExist(this.parent, val.trim())) {
          this.nameExistMessage = 'Name existed'
        } else {
          this.nameExistMessage = ''
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
