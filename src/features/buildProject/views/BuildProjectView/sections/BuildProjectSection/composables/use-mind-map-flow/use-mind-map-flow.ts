import type { Edge, Node } from '@vue-flow/core'
import { GLOBAL_NODE_HANDLES } from '@/common/components/VueFlow/global-nodes.types'
import { useFlowState } from '@/common/composables/VueFlow/use-flow-state/use-flow-state'
import { getEdgeId, remToPx } from '@/common/utils/vue-flow/vue-flow'
import { MIND_MAP_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import { RESEARCHS_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/researchs-nodes.types'
import { SELF_KNOWLEDGE_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/self-knowledge-nodes.types'
import { TRAJECTORIES_NODE_TYPES } from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/trajectories-nodes.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface UseMindMapFlowReturn {
  saveCurrentState: (prefix: string, index: string) => void
  restoreSavedState: (prefix: string, index: string) => void
  resetToInitialState: () => void
}

export function useMindMapFlow (): UseMindMapFlowReturn {
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
    data: { label: 'Qui je suis ?', right: true, left: true },
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

  // === Researchs initial nodes definitions ===
  const researchsNode: Node = {
    id: 'researchs',
    type: MIND_MAP_NODE_TYPES.MAIN_SECTION,
    parentNode: userNode.id,
    position: { x: remToPx(5) + 30, y: 10 },
    data: { label: 'Mes recherches', left: true, right: true },
  }

  const addResearchButtonNode: Node = {
    id: 'add-research',
    type: RESEARCHS_NODE_TYPES.ADD_RESEARCH_BUTTON,
    parentNode: researchsNode.id,
    position: { x: researchsNode.data.label.length * 16 + 60, y: -2 },
    data: {
      label: 'Ajouter un élément',
      icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE,
      left: true,
      right: true,
    },
  }

  // Researchs initial edges definitions
  const initialResearchsEdges: Edge[] = [
    {
      source: userNode.id,
      sourceHandle: GLOBAL_NODE_HANDLES.RIGHT,
      target: researchsNode.id,
      targetHandle: GLOBAL_NODE_HANDLES.LEFT,
    },
    {
      source: researchsNode.id,
      sourceHandle: GLOBAL_NODE_HANDLES.RIGHT,
      target: addResearchButtonNode.id,
      targetHandle: GLOBAL_NODE_HANDLES.LEFT,
    }
  ].map(edge => ({ ...edge, id: getEdgeId(edge), type: 'smoothstep' }))

  // === Trajectories initial nodes definitions ===
  const trajectoriesNode: Node = {
    id: 'trajectories',
    type: MIND_MAP_NODE_TYPES.MAIN_SECTION,
    parentNode: userNode.id,
    position: { x: -37, y: remToPx(5) + 40 },
    data: { label: 'Où je vais ?', top: true, bottom: true },
  }

  const addTrajectoryButtonNode: Node = {
    id: 'add-trajectory',
    type: TRAJECTORIES_NODE_TYPES.ADD_TRAJECTORY_BUTTON,
    parentNode: trajectoriesNode.id,
    position: { x: trajectoriesNode.data.label.length * 8 - 40, y: 100 },
    data: {
      label: 'Ajouter un élément',
      icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE,
      top: true,
      bottom: true,
    },
  }

  // === Trajectories initial edges definitions ===
  const initialTrajectoriesEdges: Edge[] = [
    {
      source: userNode.id,
      sourceHandle: GLOBAL_NODE_HANDLES.BOTTOM,
      target: trajectoriesNode.id,
      targetHandle: GLOBAL_NODE_HANDLES.TOP,
    },
    {
      source: trajectoriesNode.id,
      sourceHandle: GLOBAL_NODE_HANDLES.BOTTOM,
      target: addTrajectoryButtonNode.id,
      targetHandle: GLOBAL_NODE_HANDLES.TOP,
    }
  ].map(edge => ({ ...edge, id: getEdgeId(edge), type: 'smoothstep' }))

  // === Initial nodes ===
  const initialNodes: Node[] = [
    userNode,
    selfKnowledgeNode,
    addSelfKnowledgeButtonNode,
    researchsNode,
    addResearchButtonNode,
    trajectoriesNode,
    addTrajectoryButtonNode
  ]

  // === Initial edges ===
  const initialEdges: Edge[] = [
    ...initialSelfKnowledgeEdges,
    ...initialResearchsEdges,
    ...initialTrajectoriesEdges,
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
