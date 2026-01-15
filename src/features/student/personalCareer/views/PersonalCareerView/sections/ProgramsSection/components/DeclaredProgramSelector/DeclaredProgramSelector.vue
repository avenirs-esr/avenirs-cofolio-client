<script setup lang="ts">
import FloatingIconCard from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import SelectorOverlay from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface DeclaredProgramSelectorProps {
  declaredPrograms: { label: string, value: string }[]
}

const { declaredPrograms } = defineProps<DeclaredProgramSelectorProps>()

const selectedProgramIds = defineModel<string[]>({ default: [] })

const iconOptions = {
  name: MDI_ICONS.SCHOOL_OUTLINE,
  color: 'var(--icon)',
  bottom: 'calc(-1 * var(--spacing-xl))',
  right: 'var(--spacing-none)',
  borderColor: 'var(--other-border-skill-card)',
}
</script>

<template>
  <div class="program-selector__container av-row av-wrap av-gap-md av-p-md av-align-center av-justify-center">
    <SelectorOverlay
      v-model:selected-elements="selectedProgramIds"
      :selectable-elements="declaredPrograms"
    >
      <template #default="{ label }">
        <FloatingIconCard
          :title="label"
          :icon-options="iconOptions"
          :header-rows="2"
          height="5.625rem"
          border-color="var(--other-border-skill-card)"
          color="var(--surface-background)"
          title-color="var(--text1)"
          class="av-flex-fill"
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
