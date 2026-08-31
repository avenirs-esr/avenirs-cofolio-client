<script setup lang="ts">
import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import type { MindMapNodeTemplateProps } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import NodeTemplate from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { MIND_MAP_FLOW_ID } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'
import { useSelfKnowledgeCategory } from '@/features/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'

const { id } = defineProps<MindMapNodeTemplateProps>()

const { categoryTitle, categoryIcon } = useSelfKnowledgeCategory(computed(() => id as ESelfKnowledgeCategory))
</script>

<template>
  <NodeTemplate
    v-bind="$props"
    :flow-id="MIND_MAP_FLOW_ID"
    title-only
    title-background="var(--other-background-base)"
  >
    <template #title>
      <AvBadge
        :label="categoryTitle ?? data.label"
        small
        color="var(--text1)"
        background-color="var(--surface-background)"
        border-color="var(--other-border-skill-card)"
        :icon="categoryIcon"
      />
    </template>
  </NodeTemplate>
</template>
