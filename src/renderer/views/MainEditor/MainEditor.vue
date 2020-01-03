<template>
    <v-row no-gutters>
        <v-col cols="3" style="border-right: 1px solid black">
            <TreeView></TreeView>
        </v-col>
        <v-col cols="9">
            <div class="right" v-if="activeItem">
                <v-row style="margin: 0">
                    <v-row justify="start" class="btn-group">
                        <v-btn
                            class="mr-3"
                            color="secondary"
                            v-for="button in buttonList"
                            :key="button"
                        >{{button}}</v-btn>
                    </v-row>
                    <v-btn color="primary" @click="save">save</v-btn>
                </v-row>
                <div v-for="(locale, index) in localeList" :key="locale.name">
                    <v-text-field
                        :label="locale.name.split('.')[0]"
                        v-model="model[locale.name]"
                    ></v-text-field>
                </div>
            </div>
            <div v-else class="pa-3" style="color: #fff">
                No key selected
            </div>
        </v-col>
    </v-row>
</template>
<script>
import fs from 'fs'
import { mapState } from 'vuex'
import ItemEditor from '@/views/ItemEditor'
import TreeView from '@/views/MainEditor/TreeView'

export default {
    name: 'MainEditor',
    components: { ItemEditor, TreeView },
    data () {
        return {
            model: {},
            buttonList: []
        }
    },
    computed: {
        ...mapState(['activeItem', 'localeList'])
    },
    methods: {
        initEditor () {
            if (this.activeItem) {
                let model = {}
                for (let locale of this.localeList) {
                    model[locale.name] = this.activeItem[locale.name]
                }
                this.model = model
                let split = this.activeItem.id.split('.')
                this.buttonList = [this.activeItem.id, split[split.length - 1]]
            }
        },
        save () {
            let split = this.id.split('.')
            for (let i = 0; i < this.list.length; i++) {
                let locale = this.list[i]
                let root = locale.data
                for (let j = 0; j < split.length - 1; j++) {
                    root = root[split[j]]
                }
                root[split[split.length - 1]] = this.listModel[i]
            }
            this.saveToDisk()
        },
        saveToDisk () {
            let count = 0
            for (let i = 0; i < this.list.length; i++) {
                let locale = this.list[i]
                fs.writeFile(
                    this.activeSource + '/' + locale.name,
                    JSON.stringify(locale.data),
                    error => {
                        if (error) {
                            console.error(error)
                        }
                        count++
                        if (count === this.list.length) {
                            this.initEditor()
                        }
                    }
                )
            }
        }
    },
    watch: {
        activeItem: {
            immediate: true,
            handler: function () {
                this.initEditor()
            }
        }
    }
}
</script>
<style scoped lang="scss">
    .right {
        padding: 15px;
    }

    .btn-group {
        min-height: 30px;
        padding-bottom: 10px;
        margin: 0;

        &::v-deep .v-btn {
            text-transform: none;
        }
    }
</style>
