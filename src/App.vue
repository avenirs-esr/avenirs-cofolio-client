<template>
  <div class="app-container">
    <AppHeader />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './view/component/AppHeader.vue'
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 1rem;
}
</style>