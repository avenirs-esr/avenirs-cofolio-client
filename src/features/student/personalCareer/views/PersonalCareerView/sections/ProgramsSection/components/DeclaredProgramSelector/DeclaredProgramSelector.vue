<script setup lang="ts">
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import { ICONS } from '@/features/student/global/icons'

export interface DeclaredProgramSelectorProps {
  declaredPrograms: { label: string, value: string }[]
}

const { declaredPrograms } = defineProps<DeclaredProgramSelectorProps>()

const selectableElements = computed(() => {
  return declaredPrograms.map(program => ({
    id: program.value,
    title: program.label,
  }))
})

const selectedElementIds = defineModel<string[]>({ default: [] })
</script>

<template>
  <CompactCardSelector
    v-model="selectedElementIds"
    :elements="selectableElements"
    :icon="ICONS.DECLARED_PROGRAMS"
    color="var(--text1)"
    background-color="var(--surface-background)"
    checkbox-color="var(--dark-background-primary1)"
    overlay-color="var(--dark-background-primary1)"
    :overlay-opacity="0.25"
  />
</template>

<style lang="scss" scoped>
.floating-icon-card {
  min-width: 0 !important;
  max-width: 100% !important;
}
</style>
