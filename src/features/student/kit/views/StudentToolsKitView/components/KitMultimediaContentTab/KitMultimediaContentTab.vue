<script setup lang="ts">
import ValorizedAssociatedTracesContainer
  from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedAssociatedTracesContainer/ValorizedAssociatedTracesContainer.vue'
import ValorizedNonAssociatedTracesContainer
  from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedNonAssociatedTracesContainer/ValorizedNonAssociatedTracesContainer.vue'
</script>

<template>
  <div class="av-col av-gap-lg">
    <ValorizedAssociatedTracesContainer />
    <ValorizedNonAssociatedTracesContainer />
  </div>
</template>
