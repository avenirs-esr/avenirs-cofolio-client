<script setup lang="ts">
import type { MindMapNodeTemplateProps } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import TitleDescriptionNodeTemplate from '@/common/components/VueFlow/TitleDescriptionNodeTemplate/TitleDescriptionNodeTemplate.vue'
import { MIND_MAP_FLOW_ID } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'

defineProps<MindMapNodeTemplateProps>()
</script>

<template>
  <TitleDescriptionNodeTemplate
    v-bind="$props"
    :flow-id="MIND_MAP_FLOW_ID"
    border-color="var(--other-border-skill-card)"
    title-background="var(--surface-background)"
  />
</template>
