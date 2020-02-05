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
                            @click="copy(button)"
                        >{{button}}
                        </v-btn>
                    </v-row>
                    <v-btn color="primary" @click="save" :disabled="!needSave">save</v-btn>
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
import { mapState } from 'vuex'
import ItemEditor from '@/views/MainEditor/ItemEditor'
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
        ...mapState(['activeItem', 'localeList']),
        needSave () {
            if (this.activeItem) {
                for (let locale of this.localeList) {
                    if (this.model[locale.name] !== this.activeItem[locale.name]) {
                        return true
                    }
                }
            }
            return false
        }
    },
    methods: {
        initEditor () {
            if (this.activeItem) {
                let model = {}
                for (let locale of this.localeList) {
                    model[locale.name] = this.activeItem[locale.name]
                }
                this.model = model
                let buttonList = [this.activeItem.id]
                let split = this.activeItem.id.split('.')
                if (split.length > 1) {
                    buttonList.push(split[split.length - 1])
                }
                this.buttonList = buttonList
            }
        },
        save () {
            this.$store.dispatch('updateItemValue', { id: this.activeItem.id, ...this.model })
        },
        copy (text) {
            this.$utils.copyToClipboard(text, text + ' copied to clipboard')
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
