<template>
    <v-app id="app" dark>
        <v-app-bar app dense>
            <router-link to="/" class="mr-5">Home</router-link>
            <router-link to="/editor">Editor</router-link>
        </v-app-bar>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
export default {
  name: 'tm-i18n'
}
</script>

<style>
    #app {
        font-family: 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    html, body {
        overflow: hidden !important;
    }
</style>
