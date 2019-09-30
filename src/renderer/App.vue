<template>
    <v-app id="app" :light="true">
      <v-navigation-drawer app>
        <!-- -->
      </v-navigation-drawer>

      <v-app-bar app>
        <!-- -->
      </v-app-bar>

      <!-- Sizes your content based upon application components -->
      <v-content>

        <!-- Provides the application the proper gutter -->
        <v-container fluid>

          <!-- If using vue-router -->
          <router-view></router-view>
        </v-container>
      </v-content>

      <v-footer app>
        <!-- -->
      </v-footer>
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
