<script setup lang="ts">
import SelectorOverlay from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.vue'
import DeclaredExperienceCompactCard
  from '@/features/student/personalCareer/components/cards/DeclaredExperienceCompactCard/DeclaredExperienceCompactCard.vue'

export interface DeclaredExperienceSelectorProps {
  declaredExperiences: { label: string, value: string }[]
}

const { declaredExperiences } = defineProps<DeclaredExperienceSelectorProps>()

const selectedExperienceIds = defineModel<string[]>({ default: [] })
</script>

<template>
  <div class="experience-selector__container av-row av-wrap av-gap-md av-p-md av-align-center av-justify-center">
    <SelectorOverlay
      v-model:selected-elements="selectedExperienceIds"
      :selectable-elements="declaredExperiences"
    >
      <template #default="{ label }">
        <DeclaredExperienceCompactCard
          :title="label"
          :valorized="false"
        />
      </template>
    </SelectorOverlay>
  </div>
</template>

<style lang="scss" scoped>
.floating-icon-card {
  min-width: 0 !important;
  max-width: 100% !important;
}
</style>
