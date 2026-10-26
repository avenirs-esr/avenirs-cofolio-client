<script lang="ts" setup>
import type { EUniverse } from '@/api/avenir-esr'
import UniverseBadge from '@/common/components/badges/UniverseBadge/UniverseBadge.vue'

interface UniversesListProps {
  universes: EUniverse[]
}

defineProps<UniversesListProps>()
</script>

<template>
  <ul class="av-list-reset av-col av-gap-xs">
    <li
      v-for="universe in universes"
      :key="universe"
    >
      <UniverseBadge :universe="universe" />
    </li>
  </ul>
</template>
