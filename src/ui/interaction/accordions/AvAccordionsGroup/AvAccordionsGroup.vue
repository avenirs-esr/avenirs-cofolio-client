<script lang="ts" setup>
import type AvAccordion from '@/ui/interaction/accordions/AvAccordion/AvAccordion.vue'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'
import { DsfrAccordion, DsfrAccordionsGroup } from '@gouvminint/vue-dsfr'
import { useSlots, type VNode } from 'vue'

/**
 * Slots available in AvAccordions component.
 * Used to inject accordions via `AvAccordion` components.
 */
defineSlots<{
  /**
   * Default slot for passing `AvAccordion` components.
   */
  default?: () => VNode<typeof AvAccordion>[]
}>()

const slots = useSlots()

const accordionsItem = computed(() => slots.default?.() || [])
const activeAccordion = ref<number>()

defineExpose({ activeAccordion })
</script>

<template>
  <DsfrAccordionsGroup v-model="activeAccordion">
    <DsfrAccordion
      v-for="(accordion, index) in accordionsItem"
      :id="`accordion-${index}`"
      :key="index"
    >
      <template #title>
        <div class="title-container">
          <AvVIcon
            :size="2"
            :name="accordion.props?.icon"
            color="var(--icon)"
          />
          <h6 class="n6">
            {{ accordion.props?.title }}
          </h6>
        </div>
      </template>
      <div class="accordion-content-container">
        <component :is="(accordion.children as Record<string, unknown>).default" />
      </div>
    </DsfrAccordion>
  </DsfrAccordionsGroup>
</template>

<style lang="scss" scoped>
.title-container {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
}

:deep(.fr-accordion::before) {
  box-shadow: none !important;
}

:deep(.fr-accordion__btn) {
  padding: var(--spacing-sm) !important;
}

.accordion-content-container {
  border-top: 1px solid var(--stroke);
  padding-top: var(--spacing-sm);
}
</style>
