<template>
    <v-app id="app" :light="true">
      <v-app-bar app>
        <router-link to="/" class="mr-5">Home</router-link>
        <router-link to="/editor">Editor</router-link>
      </v-app-bar>
      <v-content>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
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
</style>
