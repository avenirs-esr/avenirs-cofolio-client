<script setup lang="ts">
import type { MindMapNodeTemplateProps } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import NodeTemplate from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { MIND_MAP_FLOW_ID } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'

defineProps<MindMapNodeTemplateProps>()
</script>

<template>
  <NodeTemplate
    v-bind="$props"
    :flow-id="MIND_MAP_FLOW_ID"
    title-only
    title-background="var(--other-background-base)"
  >
    <template #title>
      <span class="s1-bold av-text-text2">{{ data.label }}</span>
    </template>
  </NodeTemplate>
</template>
