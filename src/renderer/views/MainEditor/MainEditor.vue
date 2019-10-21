<template>
    <v-row no-gutters>
        <v-col cols="3">
            <div class="left">
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
                            :items="treeData"
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
                        <div>
                            <v-icon>mdi-music-note-plus</v-icon>
                            Add item
                        </div>
                        <div>
                            <v-icon>mdi-folder-plus</v-icon>
                            Add folder
                        </div>
                        <div @click="editItem">
                            <v-icon>mdi-square-edit-outline</v-icon>
                            Edit
                        </div>
                        <div>
                            <v-icon>mdi-delete</v-icon>
                            Delete
                        </div>
                    </div>
                </v-menu>
            </div>
        </v-col>
        <v-col cols="9">
            <div class="right">
                <v-row style="margin: 0">
                    <v-row justify="start" class="btn-group">
                        <div class="copy-btn mr-3" v-for="button in buttonList" :key="button">{{button}}</div>
                    </v-row>
                    <v-btn color="primary" @click="save">save</v-btn>
                </v-row>

                <div v-for="(locale, index) in list" :key="locale.name">
                    <v-text-field
                            :label="locale.name.split('.')[0]"
                            v-model="listModel[index]"
                    ></v-text-field>
                </div>
            </div>
        </v-col>
        <ItemEditor ref="ItemEditor" @update="updateItem"></ItemEditor>
    </v-row>
</template>
<script src="./MainEditor.js"></script>
<style scoped lang="scss" src="./MainEditor.scss"></style>
