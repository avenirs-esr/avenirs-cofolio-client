import type { Edge, Node } from '@vue-flow/core'
import { GLOBAL_NODE_HANDLES } from '@/common/components/VueFlow/global-nodes.types'
import { useFlowState } from '@/common/composables/VueFlow/use-flow-state/use-flow-state'
import { getEdgeId } from '@/common/utils/vue-flow/vue-flow'
import { MIND_MAP_NODE_TYPES } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import { SELF_KNOWLEDGE_NODE_TYPES } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/self-knowledge-nodes.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface UseMindMapFlowReturn {
  saveCurrentState: (prefix: string, index: string) => void
  restoreSavedState: (prefix: string, index: string) => void
  resetToInitialState: () => void
}

export function useMindMapFlow (): UseMindMapFlowReturn {
  const { t } = useI18n()

  // === User initial nodes definitions ===
  const userNode: Node = {
    id: 'user',
    type: MIND_MAP_NODE_TYPES.USER,
    position: { x: 500, y: 50 },
    draggable: true,
    data: {
      width: '5rem',
      height: '5rem',
    }
  }

  // === Self knowledge initial nodes definitions ===
  const selfKnowledgeNode: Node = {
    id: 'self-knowledge',
    type: MIND_MAP_NODE_TYPES.MAIN_SECTION,
    parentNode: userNode.id,
    position: { x: -230, y: 10 },
    data: { label: t('student.selfKnowledge.SelfKnowledgeMainSection.title'), right: true, left: true },
  }

  const addSelfKnowledgeButtonNode: Node = {
    id: 'add-self-knowledge',
    type: SELF_KNOWLEDGE_NODE_TYPES.ADD_SELF_KNOWLEDGE_CATEGORY_BUTTON,
    parentNode: selfKnowledgeNode.id,
    position: { x: -80, y: 5 },
    data: {
      label: 'Ajouter un élément',
      icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE,
      right: true,
      left: true,
    },
  }

  // === Self knowledge initial edges definitions ===
  const initialSelfKnowledgeEdges: Edge[] = [
    {
      source: userNode.id,
      sourceHandle: GLOBAL_NODE_HANDLES.LEFT,
      target: selfKnowledgeNode.id,
      targetHandle: GLOBAL_NODE_HANDLES.RIGHT,
    },
    {
      source: selfKnowledgeNode.id,
      sourceHandle: GLOBAL_NODE_HANDLES.LEFT,
      target: addSelfKnowledgeButtonNode.id,
      targetHandle: GLOBAL_NODE_HANDLES.RIGHT,
    }
  ].map(edge => ({ ...edge, id: getEdgeId(edge), type: 'smoothstep' }))

  // === Initial nodes ===
  const initialNodes: Node[] = [
    userNode,
    selfKnowledgeNode,
    addSelfKnowledgeButtonNode,
  ]

  // === Initial edges ===
  const initialEdges: Edge[] = [
    ...initialSelfKnowledgeEdges,
  ].map(edge => ({ ...edge, id: getEdgeId(edge), type: 'smoothstep' }))

  const { saveCurrentState, restoreSavedState, resetToInitialState } = useFlowState({
    initialNodes,
    initialEdges,
  })

  return {
    saveCurrentState,
    restoreSavedState,
    resetToInitialState,
  }
}
