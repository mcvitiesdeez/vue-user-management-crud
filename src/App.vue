<script setup lang="ts">
import UserManagementPage from './components/UserManagementPage.vue'
</script>

<template>
  <v-app>
    <v-app-bar color="rgb(253,240,213)" height="100">
      <v-app-bar-title>
        <img src="../public/G2G Logo.png" alt="logo" height="50" />
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <UserManagementPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
