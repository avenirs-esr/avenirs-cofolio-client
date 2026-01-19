<script setup lang="ts">
import { AvSideMenu } from '@avenirs-esr/avenirs-dsav'

const isCollapsed = ref(false)
</script>

<template>
  <AvSideMenu
    v-model:collapsed="isCollapsed"
    collapsed-width="fit-content"
  >
    <p>Placeholder</p>
  </AvSideMenu>
</template>
