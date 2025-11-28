<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import NodeTemplate, { type NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { AvButton, type AvButtonProps } from '@avenirs-esr/avenirs-dsav'
import { type Slot, useAttrs } from 'vue'

/**
 * Props for the ButtonNodeTemplate component.
 * Extends NodeProps and AvButtonProps.
 * Uses label from AvButtonProps.
 */
export interface ButtonNodeTemplateProps extends NodeTemplateProps, AvButtonProps {
  label: AvButtonProps['label']
}

const {
  variant,
  theme,
  isLoading,
  iconScale,
  noRadius,
  disabled,
  label,
  iconOnly,
  small,
  icon,
  noSentenceCase,
  ...props
} = defineProps<ButtonNodeTemplateProps>()
/**
 * Emits for the ButtonNodeTemplate component.
 * @emit click - Emitted when the button is clicked.
 */
defineEmits<{
  /**
   * Emitted when the button is clicked.
   */
  (e: 'click'): void
}>()

defineSlots<{
  /**
   * Slot for adding a modal. Its root element should be an AvModal component.
   */
  modal: Slot
}>()

const attr = useAttrs()

const nodeProps = computed<NodeProps>(() => ({
  ...props,
  ...attr,
}))

const avButtonProps = computed<AvButtonProps>(() => ({
  variant,
  theme,
  isLoading,
  iconScale,
  noRadius,
  disabled,
  label,
  iconOnly,
  small,
  icon,
  noSentenceCase,
}))
</script>

<template>
  <div>
    <NodeTemplate
      v-bind="nodeProps"
      :flow-id="flowId"
      title-only
      without-dropdown
      title-background="var(--other-background-base)"
    >
      <template #title>
        <AvButton
          v-bind="avButtonProps"
          icon-only
          @click="$emit('click')"
        />
      </template>
    </NodeTemplate>

    <slot name="modal" />
  </div>
</template>

<style lang="scss" scoped>
.s1-bold {
  color: var(--text2);
}

:deep(.av-card) {
  padding: 0.25rem;
  border-radius: 0.5rem;
}
</style>
