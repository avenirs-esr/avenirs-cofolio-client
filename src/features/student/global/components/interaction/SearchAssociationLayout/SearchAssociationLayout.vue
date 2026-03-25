<script setup lang="ts">
import { useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'

const { isMobile } = useAvBreakpoints()
</script>

<template>
  <div
    class="search-association-layout av-gap-sm"
    :class="isMobile ? 'av-col' : 'av-row av-align-stretch'"
    data-testid="search-association-layout"
  >
    <div
      class="av-flex-fill av-col av-gap-sm"
      data-testid="search-association-layout-search"
    >
      <slot name="search" />
    </div>

    <div
      class="av-flex-fill av-col av-gap-sm"
      data-testid="search-association-layout-selected"
    >
      <slot name="selected" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-association-layout {
  height: 32rem;
}
</style>
