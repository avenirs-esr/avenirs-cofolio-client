<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import Card, { type CardProps } from '@/common/components/cards/Card/Card.vue'
import Handles from '@/common/components/VueFlow/Handles/Handles.vue'
import NodeDropdown from '@/common/components/VueFlow/NodeDropdown/NodeDropdown.vue'
import UpdateHandlesModal from '@/common/components/VueFlow/UpdateHandlesModal/UpdateHandlesModal.vue'
import { useModal } from '@/common/composables'
import { useNodes } from '@/common/composables/VueFlow/use-nodes/use-nodes'
import { type Slot, useAttrs } from 'vue'

/**
 * Props for the NodeTemplate component.
 */
export interface NodeTemplateProps extends NodeProps, CardProps {
  /**
   * The ID of the flow the node belongs to.
   */
  flowId: string

  /**
   * If true, the dropdown menu will not be displayed.
   */
  withoutDropdown?: boolean

  /**
   * If true, the card will be displayed in title-only mode.
   */
  titleOnly?: boolean

  /**
   * Indicates whether the dropdown includes the option to update the node in the user's profile.
   */
  withProfileUpdate?: boolean
}

const {
  flowId,
  backgroundColor,
  borderColor,
  titleBackground,
  titleHeight,
  collapsible,
  collapsed,
  data,
  id,
  titleOnly,
  ...props
} = defineProps<NodeTemplateProps>()

/**
 * Emits for the NodeTemplate component.
 * @emit remove - Emitted when the node is removed.
 * @emit updateInProfile - Emitted when the node is updated in the profile.
 */
const emit = defineEmits<{
  /**
   * Emitted when the node is removed.
   * @param id - The ID of the node to remove.
   */
  (e: 'remove', id: string): void

  /**
   * Emitted when the user wants to update the node in the profile and in the API.
   */
  (e: 'updateInProfile'): void
}>()

/**
 * Slots for the NodeTemplate component.
 * @slot title - Slot for the title content.
 * @slot default - Default slot for the main content.
 */
defineSlots<{
  /**
   * Slot for the title content.
   */
  title: Slot

  /**
   * Default slot for the main content.
   */
  default: Slot
}>()

const attrs = useAttrs()

const avCardProps = computed<CardProps>(() => ({
  backgroundColor,
  borderColor,
  titleBackground,
  titleHeight,
  collapsible,
  collapsed,
  titleOnly
}))

const nodeProps = computed<NodeProps>(() => ({
  ...props,
  ...attrs,
  data,
  id
}))

const { removeNodeWithChildren, toggle } = useNodes(flowId)
const { displayModal, hideModal, showModal } = useModal()

function removeNodeHandler (nodeId: string) {
  emit('remove', nodeId)
  removeNodeWithChildren(nodeId)
}
</script>

<template>
  <div
    v-bind="nodeProps"
    class="node-container"
  >
    <Card
      :class="{ 'av-card--title-only': titleOnly }"
      v-bind="avCardProps"
    >
      <template #title>
        <div class="av-row av-gap-sm av-justify-between av-align-center">
          <slot name="title" />
        </div>
      </template>

      <slot v-if="!titleOnly" />
    </Card>

    <Handles :data="data" />

    <NodeDropdown
      v-if="!withoutDropdown"
      :collapsed="data.collapsed"
      :with-profile-update="withProfileUpdate"
      @update="displayModal"
      @collapse="() => toggle(id)"
      @remove="() => removeNodeHandler(id)"
      @update-in-profile="$emit('updateInProfile')"
    />

    <UpdateHandlesModal
      :id="id"
      :show="showModal"
      :data="data"
      @close="hideModal"
    />
  </div>
</template>

<style lang="scss" scoped>
.node-container {
  position: relative;
}

:deep(.av-card--title-only) {
  .av-card__title {
    margin: calc(var(--spacing-sm) * -1) !important;
  }
  .av-card__content-collapsible {
    padding: var(--spacing-none) !important;
  }
}
</style>
