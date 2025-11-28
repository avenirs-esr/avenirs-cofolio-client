import { GLOBAL_NODE_HANDLES } from '@/common/components/VueFlow/global-nodes.types'
import { useFlowHistoryStore } from '@/common/stores/flow-history.store'
import { getEdgeId } from '@/common/utils/vue-flow/vue-flow'
import { type Edge, type Node, type NodeProps, Position, useVueFlow } from '@vue-flow/core'

interface AddNodeParams {
  id?: string
  type: string
  position?: { x: number, y: number }
  data?: NodeProps['data']
  parentId?: string
  parentHandle?: GLOBAL_NODE_HANDLES
  nodeHandle?: GLOBAL_NODE_HANDLES
  width?: NodeProps['dimensions']['width']
  withoutSnapshot?: boolean
}
interface UseNodesReturn {
  /**
   * Function to add a new node and create an edge from a parent node to the new node.
   * The parameters for adding the new node and creating the edge are the following:
   * - `id`: Optional ID for the new node. If not provided, a random UUID will be generated.
   * - `type`: Type of the new node.
   * - `position`: Optional position for the new node. If not provided, a random position will be generated.
   * - `data`: Optional data for the new node.
   * - `parentId`: Optional ID of the parent node from which the edge will originate.
   * - `parentHandle`: Optional source handle on the parent node for the edge. Defaults to `GLOBAL_NODE_HANDLES.RIGHT`.
   * - `nodeHandle`: Optional target handle on the new node for the edge. Defaults to first true position in data or `GLOBAL_NODE_HANDLES.LEFT`.
   * - `width`: Optional width for the new node.
   */
  addNode: ({ id, type, position, data, parentId, parentHandle, nodeHandle, width }: AddNodeParams) => void

  /**
   * Function to update a node's ID and also update all edges and child nodes that reference the old ID.
   * @param nodeId Current ID of the node to be updated.
   * @param newId New ID to be assigned to the node.
   */
  updateNodeId: (nodeId: string, newId: string) => void

  /**
   * Function to remove a node by its ID.
   * Uses the `removeNodes` and `removeEdges` functions from Vue Flow to remove the node and its connected edges.
   * @param nodeId ID of the node to be removed.
   */
  removeNode: (nodeId: string) => void

  /**
   * Function to remove a node and all its child nodes recursively.
   * Uses the `removeNodes` and `removeEdges` functions from Vue Flow to remove the nodes and their connected edges.
   * @param nodeId ID of the node to be removed along with its children.
   */
  removeNodeWithChildren: (nodeId: string) => void

  /**
   * Function to toggle the collapsed state of a node.
   * Uses the `updateNode` function from Vue Flow to update the node `hidden` property and the `collapsed` property in `data`.
   * @param nodeId ID of the node to be toggled.
   */
  toggle: (nodeId: string) => void

  /**
   * Function to find a node by the title and description defined in its data.
   * @param title title of the node to be found.
   * @param description description of the node to be found.
   * @returns The found node or undefined if not found.
   */
  findNodeByTitleAndDescription: (title: string, description: string) => Node | undefined
}

/**
 * Composable for managing nodes in a Vue Flow diagram.
 * It provides several utility functions to manipulate nodes and their relationships.
 * @returns
 * - `removeNode`: Function to remove a node by its ID.
 * - `removeNodeWithChildren`: Function to remove a node and all its child nodes recursively.
 * - `toggle`: Function to toggle the collapsed state of a node.
 * - `findNodeByTitleAndDescription`: Function to find a node by the title and description defined in its data.
 */
export function useNodes (flowId: string): UseNodesReturn {
  const { nodes, edges, addNodes, addEdges, findNode, removeNodes, removeEdges, updateNode, updateEdge } = useVueFlow()
  const { saveSnapshot } = useFlowHistoryStore()

  /**
   * Function to add a new node and create an edge from a parent node to the new node.
   * @param params Parameters for adding the new node and creating the edge.
   * @param "params.id": Optional ID for the new node. If not provided, a random UUID will be generated.
   * @param "params.type": Type of the new node.
   * @param "params.position": Optional position for the new node. If not provided, a random position will be generated.
   * @param "params.data": Optional data for the new node.
   * @param "params.parentId": Optional ID of the parent node from which the edge will originate.
   * @param "params.parentHandle": Optional source handle on the parent node for the edge. Defaults to `GLOBAL_NODE_HANDLES.RIGHT`.
   * @param "params.nodeHandle": Optional target handle on the new node for the edge. Defaults to first true position in data or `GLOBAL_NODE_HANDLES.LEFT`.
   * @param "params.width": Optional width for the new node.
   * @param "params.withoutSnapshot": Optional flag to skip saving a snapshot before adding the node.
   *
   */
  function addNode ({ id, type, position, data, parentId, parentHandle, nodeHandle, width, withoutSnapshot = false }: AddNodeParams) {
    const POSITION_ORDER: Position[] = [
      Position.Top,
      Position.Right,
      Position.Bottom,
      Position.Left,
    ]

    // === Create a new node ===
    const newNode: Node = {
      id: id ?? `${type}-${crypto.randomUUID()}`,
      type,
      parentNode: parentId,
      position: position ?? {
        x: Math.random() * 150,
        y: Math.random() * 150,
      },
      data,
      width,
    }
    if (!withoutSnapshot) {
      saveSnapshot(flowId, nodes.value, edges.value)
    }
    addNodes([newNode])

    // === Create a new edge from the parent to the new node ===
    if (parentId) {
      const newEdgeWithoutId: Omit<Edge, 'id'> = {
        source: parentId,
        sourceHandle: parentHandle ?? GLOBAL_NODE_HANDLES.RIGHT,
        target: newNode.id,
        targetHandle: nodeHandle ?? POSITION_ORDER.find(pos => data?.[pos] === true) ?? GLOBAL_NODE_HANDLES.LEFT,
        type: 'smoothstep',
      }
      const newEdge: Edge = {
        ...newEdgeWithoutId,
        id: getEdgeId(newEdgeWithoutId),
      }

      addEdges([newEdge])
    }
  }

  /**
   * Function to update a node's ID and also update all edges and child nodes that reference the old ID.
   * @param nodeId Current ID of the node to be updated.
   * @param newId New ID to be assigned to the node.
   */
  function updateNodeId (nodeId: string, newId: string) {
    updateNode(nodeId, { id: newId })
    edges.value.forEach((edge) => {
      let updated = false
      const updatedEdge = { ...edge }

      if (edge.source === nodeId) {
        updatedEdge.source = newId
        updated = true
      }
      if (edge.target === nodeId) {
        updatedEdge.target = newId
        updated = true
      }

      if (updated) {
        updateEdge(edge, updatedEdge)
      }
    })
    nodes.value.forEach((node) => {
      if (node.parentNode === nodeId) {
        updateNode(node.id, { parentNode: newId })
      }
    })
  }

  /**
   * Function to remove a node by its ID.
   * Uses the `removeNodes` and `removeEdges` functions from Vue Flow to remove the node and its connected edges.
   * @param nodeId ID of the node to be removed.
   */
  function removeNode (nodeId: string) {
    const node = findNode(nodeId)
    if (!node) {
      return
    }

    saveSnapshot(flowId, nodes.value, edges.value)
    removeNodes([nodeId])
    removeEdges(edges.value.filter(edge => edge.source === nodeId || edge.target === nodeId))
  }

  /**
   * Helper function to collect all IDs of a node and its children recursively.
   * @param nodeId ID of the node.
   * @returns Array of IDs including the node and all its children.
   */
  function collectNodeAndChildrenIds (nodeId: string) {
    const node = findNode(nodeId)
    if (!node) {
      return []
    }

    let idsToRemove = [nodeId]

    nodes.value.forEach((childNode) => {
      if (childNode.parentNode === nodeId) {
        idsToRemove = idsToRemove.concat(collectNodeAndChildrenIds(childNode.id))
      }
    })

    return idsToRemove
  }

  /**
   * Function to remove a node and all its child nodes recursively.
   * Uses the `removeNodes` and `removeEdges` functions from Vue Flow to remove the nodes and their connected edges.
   * @param nodeId ID of the node to be removed along with its children.
   */
  function removeNodeWithChildren (nodeId: string) {
    const idsToRemove = collectNodeAndChildrenIds(nodeId)
    if (idsToRemove.length === 0) {
      return
    }

    saveSnapshot(flowId, nodes.value, edges.value)
    removeNodes(idsToRemove)
    removeEdges(edges.value.filter(edge => idsToRemove.includes(edge.source) || idsToRemove.includes(edge.target)))
  }

  /**
   * Function to find a node by the title and description defined in its data.
   * @param title title of the node to be found.
   * @param description description of the node to be found.
   * @returns The found node or undefined if not found.
   */
  function findNodeByTitleAndDescription (title: string, description: string) {
    return nodes.value.find(node => node.data.title === title && node.data.description === description)
  }

  /**
   * Function to hide all child nodes of a given parent node recursively.
   * Uses the `updateNode` function from Vue Flow to set the `hidden` property of child nodes to true.
   * @param parentId ID of the parent node.
   */
  function hideChildren (parentId: string) {
    nodes.value.forEach((node) => {
      if (node.parentNode === parentId) {
        updateNode(node.id, { hidden: true })
        hideChildren(node.id)
      }
    })
  }

  /**
   * Function to show all child nodes of a given parent node recursively.
   * Uses the `updateNode` function from Vue Flow to set the `hidden` property of child nodes to false.
   * @param parentId ID of the parent node.
   */
  function showChildren (parentId: string) {
    nodes.value.forEach((node) => {
      if (node.parentNode === parentId) {
        updateNode(node.id, { hidden: false })
        showChildren(node.id)
      }
    })
  }

  /**
   * Function to toggle the collapsed state of a node.
   * Uses the `updateNode` function from Vue Flow to update the node `hidden` property and the `collapsed` property in `data`.
   * @param nodeId ID of the node to be toggled.
   */
  function toggle (nodeId: string) {
    const node = findNode(nodeId)
    if (!node) {
      return
    }

    node.data.collapsed = !node.data.collapsed

    if (node.data.collapsed) {
      hideChildren(nodeId)
    }
    else {
      showChildren(nodeId)
    }

    updateNode(nodeId, { data: node.data })
  }

  return {
    addNode,
    updateNodeId,
    removeNode,
    removeNodeWithChildren,
    toggle,
    findNodeByTitleAndDescription
  }
}
