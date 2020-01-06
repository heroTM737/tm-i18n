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

import TreeService from '@/services/tree.service'

export default {
    name: 'ItemEditor',
    data () {
        return {
            show: false,
            formValid: false,
            name: null,
            parent: null,
            createParent: false,
            isAdd: false,
            isFolder: false,
            item: null,
            promise: null
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
            return new Promise((resolve, reject) => {
                this.promise = { resolve, reject }
            })
        },
        submit () {
            if (this.formValid) {
                this.promise.resolve({
                    oldItemId: this.item.id,
                    id: TreeService.createItemId(this.parent, this.name),
                    isAdd: this.isAdd,
                    createParent: this.createParent,
                    isFolder: this.isFolder
                })
                this.show = false
            } else {
                this.$refs.form.validate()
            }
        },
        cancel () {
            this.show = false
            this.$refs.form.reset()
            this.promise.reject(null)
        },
        parentRules (val) {
            if (!val) {
                return true
            }
            if (val.includes(' ')) {
                return 'Parent should not contain space'
            }
            if (!this.createParent) {
                if (!TreeService.checkItemExist(this.parent)) {
                    return 'Parent not existed'
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
            if (TreeService.checkItemExist(TreeService.createItemId(this.parent, val))) {
                return 'Name existed'
            }
            return true
        }
    },
    watch: {
        createParent () {
            this.$refs.form.validate()
        }
    }
}
</script>

<style scoped>

</style>
