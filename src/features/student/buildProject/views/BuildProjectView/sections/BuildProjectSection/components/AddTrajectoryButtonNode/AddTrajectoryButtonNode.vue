<script setup lang="ts">
import type { MindMapNodeTemplateProps } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import ButtonNodeTemplate from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.vue'
import { GLOBAL_NODE_HANDLES } from '@/common/components/VueFlow/global-nodes.types'
import { useNodes } from '@/common/composables/VueFlow/use-nodes/use-nodes'
import { MIND_MAP_FLOW_ID } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'
import { TRAJECTORIES_NODE_TYPES } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/trajectories-nodes.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { id } = defineProps<MindMapNodeTemplateProps>()

const { t } = useI18n()
const { addNode } = useNodes(MIND_MAP_FLOW_ID)

const trajectoryNodesCount = ref(0)

function addTrajectoryNode () {
  addNode({
    id: `trajectory-${crypto.randomUUID()}`,
    type: TRAJECTORIES_NODE_TYPES.TRAJECTORY,
    position: { x: 100, y: trajectoryNodesCount.value * 140 },
    data: {
      title: `Trajectoire ${trajectoryNodesCount.value + 1}`,
      subtitle: 'Sous titre',
      description: 'Description de la trajectoire',
      left: true,
    },
    parentId: id,
    parentHandle: GLOBAL_NODE_HANDLES.BOTTOM,
  })

  trajectoryNodesCount.value += 1
}
</script>

<template>
  <ButtonNodeTemplate
    v-bind="$props"
    :flow-id="MIND_MAP_FLOW_ID"
    :label="t('student.buildProject.mindMap.trajectories.addTrajectoryButton.label')"
    :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
    @click="addTrajectoryNode"
  />
</template>
