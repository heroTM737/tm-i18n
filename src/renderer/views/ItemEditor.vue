<template>
    <v-dialog v-model="show" width="650" persistent>
        <v-card>
            <v-card-title>
                {{isAdd ? 'Add' : 'Edit'}} {{isFolder ? 'Folder' : 'Item'}}
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="submit" ref="form" v-model="formValid">
                    <v-text-field
                        :rules="[parentRules]"
                        label="Parent"
                        v-model="parent"
                    ></v-text-field>
                    <v-checkbox
                        label="Create parent if not exist"
                        v-model="createParent"
                    ></v-checkbox>
                    <v-text-field
                        :rules="[nameRules]"
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
    props: {
        checkExist: Function
    },
    data () {
        return {
            show: false,
            formValid: false,
            name: null,
            parent: null,
            createParent: false,
            isAdd: false,
            isFolder: false,
            item: null
        }
    },
    methods: {
        open (item, isFolder) {
            if (item) {
                this.item = item
                this.isAdd = false
                this.name = item.name
                let lastIndexOfDot = item.id.lastIndexOf('.')
                if (lastIndexOfDot >= 0) {
                    this.parent = item.id.substring(0, lastIndexOfDot)
                } else {
                    this.parent = ''
                }
            } else {
                this.item = null
                this.isAdd = true
                this.name = ''
                this.parent = ''
                this.isFolder = !!isFolder
            }
            this.show = true
        },
        submit () {
            if (this.formValid) {
                let item = {
                    name: this.name,
                    parent: this.parent
                }
                this.$emit('update', item, this.isAdd, this.isFolder)
                this.show = false
            } else {
                this.$refs.form.validate()
            }
        },
        cancel () {
            this.show = false
            this.$refs.form.reset()
        },
        parentRules (val) {
            if (val.includes(' ')) {
                return 'Parent should not contain space'
            }
            if (!this.createParent) {
                if (this.checkExist && this.checkExist(this.parent, val)) {
                    return 'Name existed'
                }
            }
            return true
        },
        nameRules (val) {
            if (val === undefined || val === null || val === '') {
                return 'Name is required'
            }
            if (val.includes(' ')) {
                return 'Name should not contain space'
            }
            if (this.checkExist && this.checkExist(this.parent, val)) {
                return 'Name existed'
            }
            return true
        }
    }
}
</script>

<style scoped>

</style>
