<script setup lang="ts">
import SelectorOverlay from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.vue'
import DeclaredProgramCompactCard
  from '@/features/student/personalCareer/components/cards/DeclaredProgramCompactCard/DeclaredProgramCompactCard.vue'

export interface DeclaredProgramSelectorProps {
  declaredPrograms: { label: string, value: string }[]
}

const { declaredPrograms } = defineProps<DeclaredProgramSelectorProps>()

const selectedProgramIds = defineModel<string[]>({ default: [] })
</script>

<template>
  <div class="program-selector__container av-row av-wrap av-gap-md av-p-md av-align-center av-justify-center">
    <SelectorOverlay
      v-model:selected-elements="selectedProgramIds"
      :selectable-elements="declaredPrograms"
    >
      <template #default="{ label }">
        <DeclaredProgramCompactCard
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
