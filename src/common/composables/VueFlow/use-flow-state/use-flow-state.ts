import { useToasterStore } from '@/store'
import { type Edge, type Node, useVueFlow } from '@vue-flow/core'
import { useI18n } from 'vue-i18n'

interface UseFlowStateParams {
  /**
   * The initial set of nodes for the flow diagram.
   */
  initialNodes: Node[]

  /**
   * The initial set of edges for the flow diagram.
   */
  initialEdges: Edge[]
}

interface UseFlowStateReturn {
  /**
   * Save the current state of nodes and edges to local storage.
   * Also shows a success message.
   * @param prefix The prefix to use for the local storage keys.
   * @param index The index to use for the local storage keys.
   */
  saveCurrentState: (prefix: string, index: string) => void

  /**
   * Restore the state of nodes and edges from local storage.
   * @param prefix The prefix used for the local storage keys.
   * @param index The index used for the local storage keys.
   */
  restoreSavedState: (prefix: string, index: string) => void

  /**
   * Reset the flow diagram to its initial state.
   * Uses the initial nodes and edges provided to the composable.
   * Uses the setNodes and setEdges methods from Vue Flow.
   */
  resetToInitialState: () => void
}

/**
 * Composable to manage saving, restoring, and resetting the state of a Vue Flow diagram.
 * @param params Parameters for the flow state management.
 * @param "params.initialNodes" The initial set of nodes for the flow diagram.
 * @param "params.initialEdges" The initial set of edges for the flow diagram.
 * @returns The methods to save, restore, and reset the flow state.
 * - `saveCurrentState`: Save the current state of nodes and edges to local storage.
 * - `restoreSavedState`: Restore the state of nodes and edges from local storage.
 * - `resetToInitialState`: Reset the flow diagram to its initial state.
 */
export function useFlowState ({ initialNodes, initialEdges }: UseFlowStateParams): UseFlowStateReturn {
  const { nodes, edges, setNodes, setEdges } = useVueFlow()

  const { addSuccessMessage } = useToasterStore()
  const { t } = useI18n()

  /**
   * Save the current state of nodes and edges to local storage.
   * Also shows a success message.
   * @param prefix The prefix to use for the local storage keys.
   * @param index The index to use for the local storage keys.
   */
  function saveCurrentState (prefix: string, index: string) {
    localStorage.setItem(`${prefix}-flow-nodes-${index}`, JSON.stringify(nodes.value))
    localStorage.setItem(`${prefix}-flow-edges-${index}`, JSON.stringify(edges.value))
    addSuccessMessage({ description: t('global.vueFlow.state.saved', { index }), timeout: 2000 })
  }

  /**
   * Restore the state of nodes and edges from local storage.
   * @param prefix The prefix used for the local storage keys.
   * @param index The index used for the local storage keys.
   */
  function restoreSavedState (prefix: string, index: string) {
    const savedNodes = localStorage.getItem(`${prefix}-flow-nodes-${index}`)
    const savedEdges = localStorage.getItem(`${prefix}-flow-edges-${index}`)

    if (!savedNodes?.length || !savedEdges?.length) {
      setNodes(initialNodes)
      setEdges(initialEdges)
      return
    }

    setNodes(JSON.parse(savedNodes))
    setEdges(JSON.parse(savedEdges))
  }

  /**
   * Reset the flow diagram to its initial state.
   * Uses the initial nodes and edges provided to the composable.
   * Uses the setNodes and setEdges methods from Vue Flow.
   */
  function resetToInitialState () {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }

  return {
    saveCurrentState,
    restoreSavedState,
    resetToInitialState,
  }
}
