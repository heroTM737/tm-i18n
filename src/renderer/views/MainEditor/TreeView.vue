<template>
    <div>
        <div class="px-3">
            <v-text-field
                label="Search"
                v-model="search"
                append-icon="mdi-magnify"
            ></v-text-field>
        </div>
        <div class="tree-container">
            <v-treeview
                :search="search"
                :items="items"
                dense
                hoverable
                :activatable="true"
                :open-on-click="true"
                @update:active="itemClick"
                active-class="active"
                class="tree"
            >
                <template slot="label" slot-scope="{item}" absolute>
                    <div @contextmenu="showContextMenu($event, item)" class="node-label">{{item.name}}</div>
                </template>
            </v-treeview>
        </div>
        <v-menu v-model="contextMenuShow" :position-x="x" :position-y="y" absolute offset-y>
            <div class="context-menu">
                <div @click="addItem">
                    <v-icon>mdi-music-note-plus</v-icon>
                    Add item
                </div>
                <div @click="addFolder">
                    <v-icon>mdi-folder-plus</v-icon>
                    Add folder
                </div>
                <div @click="updateItem">
                    <v-icon>mdi-square-edit-outline</v-icon>
                    Edit
                </div>
                <div @click="deleteItem">
                    <v-icon>mdi-delete</v-icon>
                    Delete
                </div>
            </div>
        </v-menu>
        <ItemEditor ref="ItemEditor"></ItemEditor>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ItemEditor from '@/views/MainEditor/ItemEditor'

export default {
    name: 'TreeView',
    components: { ItemEditor },
    data () {
        return {
            search: '',
            contextMenuShow: false,
            x: 0,
            y: 0,
            activeItem: null,
            items: []
        }
    },
    computed: {
        ...mapState(['tree', 'localeList', 'forceUpdate'])
    },
    methods: {
        initView () {
            this.items = this.loopTree(this.tree, '')
        },
        loopTree (root, parentId) {
            let data = []
            for (let i in root) {
                let id = parentId ? parentId + '.' + i : i
                let item = {
                    id: id,
                    name: i
                }
                if (typeof root[i] === 'object') {
                    item.children = this.loopTree(root[i], id)
                }
                data.push(item)
            }
            return data
        },
        showContextMenu (e, item) {
            this.activeItem = item
            e.preventDefault()
            this.x = e.clientX
            this.y = e.clientY
            this.$nextTick(() => {
                this.contextMenuShow = true
            })
        },
        itemClick (items) {
            this.$store.dispatch('activeItemId', items[0])
        },
        addFolder () {
            this.$refs.ItemEditor.open(null, true).then(
                result => {
                    this.$store.dispatch('addFolder', result)
                }
            )
        },
        addItem () {
            this.$refs.ItemEditor.open(null).then(
                result => {
                    this.$store.dispatch('addItem', result)
                }
            )
        },
        updateItem () {
            this.$refs.ItemEditor.open(this.activeItem).then(
                result => {
                    this.$store.dispatch('updateItem', result)
                }
            )
        },
        deleteItem (itemID) {
            this.$store.dispatch('deleteItem', itemID)
        }
    },
    watch: {
        forceUpdate: {
            immediate: true,
            handler: function () {
                this.initView()
            }
        }
    }
}
</script>

<style scoped lang="scss">
    .tree-container {
        height: calc(100vh - 118px);
        overflow: auto;
        /* width */
        &::-webkit-scrollbar {
            width: 10px;
        }

        /* Track */
        &::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        /* Handle */
        &::-webkit-scrollbar-thumb {
            background: #888;
        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    }

    .tree::v-deep {
        .active {
            background: #c6c6c6;
        }
    }

    .context-menu {
        background: #303030;

        &::v-deep .v-icon {
            vertical-align: text-bottom;
        }

        div {
            padding: 5px;
            color: #fff;
            cursor: pointer;

            &:hover {
                background: #030303;
            }
        }
    }

    .node-label {
        height: 40px;
        display: flex;
        align-items: center;
    }
</style>
