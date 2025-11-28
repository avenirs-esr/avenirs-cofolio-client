import { useFlowHistoryStore } from '@/common/stores/flow-history.store'
import { getEdgeId } from '@/common/utils/vue-flow/vue-flow'
import { type Connection, type Edge, useVueFlow } from '@vue-flow/core'

interface UseEdgesReturn {
  /**
   * Handler for connecting two nodes in the flow. Uses the `addEdges` function from Vue Flow to add a new edge.
   * @param connection Connection object containing source and target information.
   */
  onConnect: (connection: Connection) => void
}

export function useEdges (flowId: string): UseEdgesReturn {
  const { edges, nodes, addEdges } = useVueFlow()
  const { saveSnapshot } = useFlowHistoryStore()

  /**
   * Validates a connection between two nodes.
   * @param connection Connection object containing source and target information.
   * @returns Boolean indicating whether the connection is valid.
   */
  function isValidConnection (connection: Connection) {
    const from = connection.sourceHandle
    const to = connection.targetHandle

    if (!to) {
      console.warn('Invalid connection: target handle is missing')
      return false
    }

    if (!from) {
      console.warn('Invalid connection: source handle is missing')
      return false
    }

    return true
  }

  /**
   * Handler for connecting two nodes in the flow. Uses the `addEdges` function from Vue Flow to add a new edge.
   * @param connection Connection object containing source and target information.
   */
  function onConnect (connection: Connection) {
    if (!isValidConnection(connection)) {
      return
    }

    const newEdge: Edge = {
      ...connection,
      type: 'smoothstep',
      id: getEdgeId(connection),
    }

    if (edges.value.find(edge => edge.id === newEdge.id)) {
      return
    }

    saveSnapshot(flowId, nodes.value, edges.value)
    addEdges([newEdge])
  }

  return {
    onConnect,
  }
}
