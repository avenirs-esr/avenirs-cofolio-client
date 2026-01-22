<script setup lang="ts">
import LinkInputNode from '@/common/components/VueFlow/LinkInputNode/LinkInputNode.vue'
import TextInputNode from '@/common/components/VueFlow/TextInputNode/TextInputNode.vue'
import { useEdges } from '@/common/composables/VueFlow/use-edges/use-edges'
import { useFlowScreenshot } from '@/common/composables/VueFlow/use-flow-screenshot/use-flow-screenshot'
import { useFlowHistoryStore } from '@/common/stores/flow-history.store'
import AddResearchButtonNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddResearchButtonNode/AddResearchButtonNode.vue'
import AddSelfKnowledgeCategoryButtonNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddSelfKnowledgeCategoryButtonNode/AddSelfKnowledgeCategoryButtonNode.vue'
import AddSelfKnowledgeElementButtonNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddSelfKnowledgeElementButtonNode/AddSelfKnowledgeElementButtonNode.vue'
import AddTrajectoryButtonNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/AddTrajectoryButtonNode/AddTrajectoryButtonNode.vue'
import MainSectionNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MainSectionNode/MainSectionNode.vue'
import { MIND_MAP_FLOW_ID } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'
import ResearchNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/ResearchNode/ResearchNode.vue'
import SelfKnowledgeCategoryNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/SelfKnowledgeCategoryNode/SelfKnowledgeCategoryNode.vue'
import SelfKnowledgeElementNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/SelfKnowledgeElementNode/SelfKnowledgeElementNode.vue'
import TrajectoryNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/TrajectoryNode/TrajectoryNode.vue'
import UserNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/UserNode/UserNode.vue'
import { useMindMapFlow } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/composables/use-mind-map-flow/use-mind-map-flow'
import { AvButton, AvIconText, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useVueFlow, VueFlow } from '@vue-flow/core'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { nodes, edges, setNodes, setEdges } = useVueFlow()
const {
  saveCurrentState,
  restoreSavedState,
  resetToInitialState,
} = useMindMapFlow()
const { canUndo, canRedo, redo, undo } = useFlowHistoryStore()
const { doScreenshot } = useFlowScreenshot()
const { onConnect } = useEdges(MIND_MAP_FLOW_ID)

restoreSavedState(MIND_MAP_FLOW_ID, '1')
</script>

<template>
  <div class="av-col av-gap-sm">
    <AvIconText
      :icon="RI_ICONS.LOADER_LINE"
      icon-color="var(--icon)"
      :text="t('student.buildProject.mindMap.title')"
      text-color="var(--title)"
      typography-class="n5"
      gap="var(--spacing-xs)"
    />
    <div class="av-row av-align-center av-gap-sm">
      <AvButton
        :label="t('global.buttons.undo')"
        :icon="MDI_ICONS.UNDO"
        variant="OUTLINED"
        icon-only
        :disabled="!canUndo(MIND_MAP_FLOW_ID)"
        @click="() => undo(MIND_MAP_FLOW_ID, nodes, edges, setNodes, setEdges)"
      />
      <AvButton
        :label="t('global.buttons.redo')"
        :icon="MDI_ICONS.REDO"
        variant="OUTLINED"
        icon-only
        :disabled="!canRedo(MIND_MAP_FLOW_ID)"
        @click="() => redo(MIND_MAP_FLOW_ID, nodes, edges, setNodes, setEdges)"
      />
      <AvButton
        :label="t('global.buttons.save')"
        :icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
        variant="OUTLINED"
        icon-only
        @click="() => saveCurrentState('mind-map', '1')"
      />
      <AvButton
        :label="t('global.buttons.restore')"
        :icon="MDI_ICONS.HISTORY"
        variant="OUTLINED"
        icon-only
        @click="() => restoreSavedState('mind-map', '1')"
      />
      <AvButton
        :label="t('global.buttons.reset')"
        :icon="MDI_ICONS.FILE_RESTORE_OUTLINE"
        variant="OUTLINED"
        icon-only
        @click="resetToInitialState"
      />
      <AvButton
        :label="t('student.buildProject.mindMap.actions.screenshot')"
        :icon="MDI_ICONS.PRINTER_OUTLINE"
        variant="OUTLINED"
        icon-only
        @click="() => doScreenshot('mind-map')"
      />
    </div>
    <div class="mind-map-container av-border-width-sm av-border-style-solid">
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        @connect="onConnect"
      >
        <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
        <template #node-user="userNodeProps">
          <UserNode v-bind="userNodeProps" />
        </template>
        <template #node-main-section="mainSectionNodeProps">
          <MainSectionNode v-bind="mainSectionNodeProps" />
        </template>
        <template #node-self-knowledge-category="selfKnowledgeCategoryNodeProps">
          <SelfKnowledgeCategoryNode v-bind="selfKnowledgeCategoryNodeProps" />
        </template>
        <template #node-add-self-knowledge-category-button="addSelfKnowledgeCategoryButtonNodeProps">
          <AddSelfKnowledgeCategoryButtonNode v-bind="addSelfKnowledgeCategoryButtonNodeProps" />
        </template>
        <template #node-add-self-knowledge-element-button="addSelfKnowledgeElementButtonNodeProps">
          <AddSelfKnowledgeElementButtonNode v-bind="addSelfKnowledgeElementButtonNodeProps" />
        </template>
        <template #node-self-knowledge-element="selfKnowledgeElementNodeProps">
          <SelfKnowledgeElementNode v-bind="selfKnowledgeElementNodeProps" />
        </template>
        <template #node-trajectory="trajectoryNodeProps">
          <TrajectoryNode v-bind="trajectoryNodeProps" />
        </template>
        <template #node-add-trajectory-button="addTrajectoryButtonNodeProps">
          <AddTrajectoryButtonNode v-bind="addTrajectoryButtonNodeProps" />
        </template>
        <template #node-research="researchNodeProps">
          <ResearchNode v-bind="researchNodeProps" />
        </template>
        <template #node-add-research-button="addResearchButtonNodeProps">
          <AddResearchButtonNode v-bind="addResearchButtonNodeProps" />
        </template>
        <template #node-text-input="textInputNodeProps">
          <TextInputNode
            v-bind="textInputNodeProps"
            :flow-id="MIND_MAP_FLOW_ID"
          />
        </template>
        <template #node-link-input="linkInputNodeProps">
          <LinkInputNode
            v-bind="linkInputNodeProps"
            :flow-id="MIND_MAP_FLOW_ID"
          />
        </template>

        <!-- bind your custom edge type to a component by using slots, slot names are always `edge-<type>` -->
      </VueFlow>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mind-map-container {
  border-color: var(--stroke);
  height: 80vh;
  width: 100%;
}

:deep(.vue-flow__pane) {
  background-color: var(--other-background-base);
}

:deep(.vue-flow__handle) {
  &.source {
    background: var(--dark-background-primary1);
    border-color: var(--other-background-base);
  }
}
</style>
