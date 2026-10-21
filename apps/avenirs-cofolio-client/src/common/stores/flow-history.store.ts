import type { useVueFlow } from '@vue-flow/core'
import { defineStore } from 'pinia'

interface FlowHistoryStore {
  /**
   * Save the current state of nodes and edges to the undo stack and reset the redo stack.
   * They are saved as deep copies to prevent mutation issues.
   * @param flowId id of the flow
   * @param nodes current nodes of the flow
   * @param edges current edges of the flow
   */
  saveSnapshot: (flowId: string, nodes: FlowHistoryStack['nodes'], edges: FlowHistoryStack['edges']) => void

  /**
   * Revert to the last saved state from the undo stack and push the current state to the redo stack.
   * @param flowId id of the flow
   * @param nodes current nodes of the flow
   * @param edges current edges of the flow
   * @param setNodes function to update the nodes
   * @param setEdges function to update the edges
   */
  undo: (flowId: string, nodes: FlowHistoryStack['nodes'], edges: FlowHistoryStack['edges'], setNodes: (nodes: FlowHistoryStack['nodes']) => void, setEdges: (edges: FlowHistoryStack['edges']) => void) => void

  /**
   * Reapply the last undone state from the redo stack and push the current state to the undo stack.
   * @param flowId id of the flow
   * @param nodes current nodes of the flow
   * @param edges current edges of the flow
   * @param setNodes function to update the nodes
   * @param setEdges function to update the edges
   */
  redo: (flowId: string, nodes: FlowHistoryStack['nodes'], edges: FlowHistoryStack['edges'], setNodes: (nodes: FlowHistoryStack['nodes']) => void, setEdges: (edges: FlowHistoryStack['edges']) => void) => void

  /**
   * Indicates whether there are states available to undo.
   * @param flowId id of the flow
   * @return boolean indicating if undo is possible
   */
  canUndo: (flowId: string) => boolean

  /**
   * Indicates whether there are states available to redo.
   * @param flowId id of the flow
   * @return boolean indicating if redo is possible
   */
  canRedo: (flowId: string) => boolean
}

export interface FlowHistoryStack {
  nodes: ReturnType<typeof useVueFlow>['nodes']['value']
  edges: ReturnType<typeof useVueFlow>['edges']['value']
}

export const useFlowHistoryStore = defineStore<'flow-history', FlowHistoryStore>('flow-history', () => {
  const flows = ref<Record<string, { undoStack: FlowHistoryStack[], redoStack: FlowHistoryStack[] }>>({})

  const canUndo = (flowId: string) => {
    return (flows.value[flowId]?.undoStack.length ?? 0) > 0
  }

  const canRedo = (flowId: string) => {
    return (flows.value[flowId]?.redoStack.length ?? 0) > 0
  }

  const saveSnapshot = (flowId: string, nodes: FlowHistoryStack['nodes'], edges: FlowHistoryStack['edges']) => {
    if (!flows.value[flowId]) {
      flows.value[flowId] = { undoStack: [], redoStack: [] }
    }

    flows.value[flowId].undoStack.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    })

    flows.value[flowId].redoStack = []
  }

  const undo = (flowId: string, nodes: FlowHistoryStack['nodes'], edges: FlowHistoryStack['edges'], setNodes: (nodes: FlowHistoryStack['nodes']) => void, setEdges: (edges: FlowHistoryStack['edges']) => void) => {
    if (!canUndo(flowId)) {
      return
    }

    const last = flows.value[flowId].undoStack.pop()!

    flows.value[flowId].redoStack.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    })

    setNodes(last.nodes)
    setEdges(last.edges)
  }

  const redo = (flowId: string, nodes: FlowHistoryStack['nodes'], edges: FlowHistoryStack['edges'], setNodes: (nodes: FlowHistoryStack['nodes']) => void, setEdges: (edges: FlowHistoryStack['edges']) => void) => {
    if (!canRedo(flowId)) {
      return
    }

    const last = flows.value[flowId].redoStack.pop()!

    flows.value[flowId].undoStack.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    })

    setNodes(last.nodes)
    setEdges(last.edges)
  }

  return {
    canUndo,
    canRedo,
    saveSnapshot,
    undo,
    redo,
  }
}, {
  persist: true
})
