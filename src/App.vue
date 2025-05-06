<script setup lang="ts">
import { AvCard } from './ui';

</script>

<template>
  <div :style="{padding: '1rem'}">
  <AvCard width="200px">
    Hello, this is AvCard's content!
  </AvCard>
</div>
  <router-view />
</template>
