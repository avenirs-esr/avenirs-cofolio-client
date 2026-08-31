<script setup lang="ts">
import type { MindMapNodeTemplateProps } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import ButtonNodeTemplate from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.vue'
import { GLOBAL_NODE_HANDLES } from '@/common/components/VueFlow/global-nodes.types'
import { useNodes } from '@/common/composables/VueFlow/use-nodes/use-nodes'
import { MIND_MAP_FLOW_ID } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'
import { RESEARCHS_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/researchs-nodes.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { id } = defineProps<MindMapNodeTemplateProps>()

const { t } = useI18n()
const { addNode } = useNodes(MIND_MAP_FLOW_ID)

const researchNodesCount = ref(0)

function addResearchNode () {
  addNode({
    id: `research-${crypto.randomUUID()}`,
    type: RESEARCHS_NODE_TYPES.RESEARCH,
    position: { x: 100, y: researchNodesCount.value * 140 },
    data: {
      title: `Fiche ${researchNodesCount.value + 1}`,
      description: 'Description de la recherche...',
      left: true,
    },
    parentId: id,
    parentHandle: GLOBAL_NODE_HANDLES.RIGHT,
  })
  researchNodesCount.value += 1
}
</script>

<template>
  <ButtonNodeTemplate
    v-bind="$props"
    :flow-id="MIND_MAP_FLOW_ID"
    :label="t('student.buildProject.mindMap.researchs.addResearchButton.label')"
    :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
    @click="addResearchNode"
  />
</template>
