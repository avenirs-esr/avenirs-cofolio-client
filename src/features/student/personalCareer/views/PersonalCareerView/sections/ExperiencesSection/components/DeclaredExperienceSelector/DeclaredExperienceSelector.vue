<script setup lang="ts">
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredExperienceSelectorProps {
  declaredExperiences: { label: string, value: string }[]
}

const { declaredExperiences } = defineProps<DeclaredExperienceSelectorProps>()

const selectedExperienceIds = defineModel<string[]>({ default: [] })
</script>

<template>
  <div class="experience-selector__container av-row av-wrap av-gap-md av-p-md av-align-center av-justify-center">
    <CompactCardSelector
      v-model="selectedExperienceIds"
      :elements="declaredExperiences.map(experience => ({
        id: experience.value,
        title: experience.label,
      }))"
      :icon="MDI_ICONS.HUB_OUTLINE"
      color="var(--text1)"
      background-color="var(--surface-background)"
      checkbox-color="var(--dark-background-primary1)"
      overlay-color="var(--dark-background-primary1)"
      :overlay-opacity="0.25"
    />
  </div>
</template>

<style lang="scss" scoped>
.floating-icon-card {
  min-width: 0 !important;
  max-width: 100% !important;
}
</style>
