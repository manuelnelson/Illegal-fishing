<template>
  <v-app dark>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
    >
      <!-- <v-toolbar-side-icon @click="drawer = !drawer" /> -->
      <v-toolbar-title v-text="title"/>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        clipped: true,
        drawer: true,
        fixed: false,
        items: [
          { icon: 'apps', title: 'Welcome', to: '/' },
          { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
        ],
        miniVariant: true,
        title: 'Illegal Fishing'
      }
    }
  }
</script>
