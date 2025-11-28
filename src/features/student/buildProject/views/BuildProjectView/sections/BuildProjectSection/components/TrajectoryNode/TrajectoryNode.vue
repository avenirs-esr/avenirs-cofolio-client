<script setup lang="ts">
import type { MindMapNodeTemplateProps } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import NodeTemplate from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { MIND_MAP_FLOW_ID } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

defineProps<MindMapNodeTemplateProps>()
</script>

<template>
  <NodeTemplate
    v-bind="$props"
    :flow-id="MIND_MAP_FLOW_ID"
    title-only
    title-background="transparent"
  >
    <template #title>
      <div class="av-row av-row--middle">
        <div class="av-row av-flex-row-xxs av-row--middle left-container">
          <div class="icon-container">
            <AvIcon
              :name="MDI_ICONS.ARROW_DECISION"
              color="var(--other-background-base)"
              :size="2"
            />
          </div>
          <div class="av-flex-col-xxs">
            <span class="caption-bold">{{ data.title }}</span>
            <span class="caption-bold">{{ data.subtitle }}</span>
          </div>
        </div>
        <div class="right-container">
          <span class="caption-regular">{{ data.description }}</span>
        </div>
      </div>
    </template>
  </NodeTemplate>
</template>

<style lang="scss" scoped>
.icon-container {
  background-color: var(--dark-background-primary1);
  border-radius: var(--radius-full);
  padding: var(--spacing-xxs)
}

.left-container {
  padding: var(--spacing-none) var(--spacing-xs);
  background-color: var(--surface-background);
  gap: var(--spacing-sm);
  height: var(--dimension-5xl);
  width: 11rem;
}

.right-container {
  display: flex;
  align-items: center;
  padding: var(--spacing-none) var(--spacing-xs);
}

:deep(.av-card__title) {
  padding: var(--spacing-none);
}
</style>
