import type { Edge, Node } from '@vue-flow/core'
import { GLOBAL_NODE_HANDLES } from '@/common/components/VueFlow/global-nodes.types'
import { useNodes } from '@/common/composables/VueFlow/use-nodes/use-nodes'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockNodes = ref<Node[]>([])
const mockEdges = ref<Edge[]>([])
const mockAddNodes = vi.fn((newNodes: Node[]) => {
  mockNodes.value = [...mockNodes.value, ...newNodes]
})
const mockAddEdges = vi.fn((newEdges: Edge[]) => {
  mockEdges.value = [...mockEdges.value, ...newEdges]
})
const mockFindNode = vi.fn((id: string) => {
  return mockNodes.value.find(node => node.id === id)
})
const mockRemoveNodes = vi.fn((nodeIds: string[]) => {
  mockNodes.value = mockNodes.value.filter(node => !nodeIds.includes(node.id))
})
const mockRemoveEdges = vi.fn((edgeIds: string[]) => {
  mockEdges.value = mockEdges.value.filter(edge => !edgeIds.includes(edge.id))
})
const mockUpdateNode = vi.fn((nodeId: string, updates: Partial<Node>) => {
  mockNodes.value = mockNodes.value.map((node) => {
    if (node.id !== nodeId) {
      return node
    }

    return {
      ...node,
      ...updates,
      data: {
        ...(node.data ?? {}),
        ...(updates.data ?? {}),
      },
    }
  })
})
const mockUpdateEdge = vi.fn((edgeId: string, updates: Partial<Edge>) => {
  mockEdges.value = mockEdges.value.map((edge) => {
    if (edge.id === edgeId) {
      return { ...edge, ...updates }
    }
    return edge
  })
})
const mockSetNodes = vi.fn((newNodes: Node[]) => {
  mockNodes.value = newNodes
})
const mockSetEdges = vi.fn((newEdges: Edge[]) => {
  mockEdges.value = newEdges
})

vi.mock('@vue-flow/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vue-flow/core')>()
  return {
    ...actual,
    useVueFlow: () => ({
      nodes: mockNodes,
      edges: mockEdges,
      addNodes: mockAddNodes,
      addEdges: mockAddEdges,
      findNode: mockFindNode,
      removeNodes: mockRemoveNodes,
      removeEdges: mockRemoveEdges,
      updateNode: mockUpdateNode,
      updateEdge: mockUpdateEdge,
      setNodes: mockSetNodes,
      setEdges: mockSetEdges
    }),
  }
})

BddTest().given('an useNodes composable', () => {
  let composableResult: ReturnType<typeof useNodes>
  const flowId = 'test-flow'

  BddTest().when('the composable is initialized', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      composableResult = mountComposable(() => useNodes(flowId), { usePinia: true }).result
    })

    BddTest().then('it should expose the requried methods and properties', () => {
      expect(composableResult).toHaveProperty('addNode')
      expect(composableResult).toHaveProperty('updateNodeId')
      expect(composableResult).toHaveProperty('removeNode')
      expect(composableResult).toHaveProperty('removeNodeWithChildren')
      expect(composableResult).toHaveProperty('toggle')
      expect(composableResult).toHaveProperty('findNodeByTitleAndDescription')
      expect(typeof composableResult.addNode).toBe('function')
      expect(typeof composableResult.updateNodeId).toBe('function')
      expect(typeof composableResult.removeNode).toBe('function')
      expect(typeof composableResult.removeNodeWithChildren).toBe('function')
      expect(typeof composableResult.toggle).toBe('function')
      expect(typeof composableResult.findNodeByTitleAndDescription).toBe('function')
    })
  })

  BddTest().when('addNode is called with all parameters', () => {
    const addNodeParams = {
      id: '1',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: { label: 'Node 1' },
      parentId: 'parent-1',
      parentHandle: GLOBAL_NODE_HANDLES.BOTTOM,
      nodeHandle: GLOBAL_NODE_HANDLES.TOP,
      width: 150,
    }

    beforeEach(() => {
      vi.clearAllMocks()
      composableResult.addNode(addNodeParams)
    })

    BddTest().then('it should add the new node and edge correctly', () => {
      expect(mockAddNodes).toHaveBeenCalledWith([{
        id: addNodeParams.id,
        type: addNodeParams.type,
        position: addNodeParams.position,
        data: addNodeParams.data,
        parentNode: addNodeParams.parentId,
        width: addNodeParams.width,
      }])

      expect(mockAddEdges).toHaveBeenCalledWith([{
        id: expect.stringContaining(`${addNodeParams.parentId}`),
        source: addNodeParams.parentId,
        sourceHandle: addNodeParams.parentHandle,
        target: addNodeParams.id,
        targetHandle: addNodeParams.nodeHandle,
        type: 'smoothstep',
      }])
    })
  })

  BddTest().when('addNode is called with minimal parameters', () => {
    const addNodeParams = {
      type: 'custom',
    }

    beforeEach(() => {
      vi.clearAllMocks()
      composableResult.addNode(addNodeParams)
    })

    BddTest().then('it should add the new node with generated id and position', () => {
      expect(mockAddNodes).toHaveBeenCalled()
      const addedNode = mockAddNodes.mock.calls[0][0][0]
      expect(addedNode.id).toMatch(new RegExp(`^${addNodeParams.type}-`))
      expect(addedNode.type).toBe(addNodeParams.type)
      expect(addedNode.position).toHaveProperty('x')
      expect(addedNode.position).toHaveProperty('y')
    })

    BddTest().then('it should not add any edges', () => {
      expect(mockAddEdges).not.toHaveBeenCalled()
    })
  })

  BddTest().when('addNode is called with minimal parameters and a parentId', () => {
    const addNodeParams = {
      type: 'custom',
      parentId: 'parent-2',
    }

    beforeEach(() => {
      vi.clearAllMocks()
      composableResult.addNode(addNodeParams)
    })

    BddTest().then('it should add the new node with generated id and position', () => {
      expect(mockAddNodes).toHaveBeenCalled()
      const addedNode = mockAddNodes.mock.calls[0][0][0]
      expect(addedNode.id).toMatch(new RegExp(`^${addNodeParams.type}-`))
      expect(addedNode.type).toBe(addNodeParams.type)
      expect(addedNode.position).toHaveProperty('x')
      expect(addedNode.position).toHaveProperty('y')
    })

    BddTest().then('it should add an edge from the parent to the new node', () => {
      expect(mockAddEdges).toHaveBeenCalled()
      const addedNode = mockAddNodes.mock.calls[0][0][0]
      const addedEdge = mockAddEdges.mock.calls[0][0][0]
      expect(addedEdge.source).toBe(addNodeParams.parentId)
      expect(addedEdge.sourceHandle).toBe(GLOBAL_NODE_HANDLES.RIGHT)
      expect(addedEdge.target).toBe(addedNode.id)
      expect(addedEdge.targetHandle).toBe(GLOBAL_NODE_HANDLES.LEFT)
    })
  })

  BddTest().when('addNode is called with minimal parameters and a parentId, and specific pos in data', () => {
    const addNodeParams = {
      type: 'custom',
      parentId: 'parent-3',
      data: { top: true },
    }

    beforeEach(() => {
      vi.clearAllMocks()
      composableResult.addNode(addNodeParams)
    })

    BddTest().then('it should add the new node with generated id and position', () => {
      expect(mockAddNodes).toHaveBeenCalled()
      const addedNode = mockAddNodes.mock.calls[0][0][0]
      expect(addedNode.id).toMatch(new RegExp(`^${addNodeParams.type}-`))
      expect(addedNode.type).toBe(addNodeParams.type)
      expect(addedNode.position).toHaveProperty('x')
      expect(addedNode.position).toHaveProperty('y')
    })

    BddTest().then('it should add an edge from the parent to the new node with correct targetHandle', () => {
      expect(mockAddEdges).toHaveBeenCalled()
      const addedNode = mockAddNodes.mock.calls[0][0][0]
      const addedEdge = mockAddEdges.mock.calls[0][0][0]
      expect(addedEdge.source).toBe(addNodeParams.parentId)
      expect(addedEdge.sourceHandle).toBe(GLOBAL_NODE_HANDLES.RIGHT)
      expect(addedEdge.target).toBe(addedNode.id)
      expect(addedEdge.targetHandle).toBe(GLOBAL_NODE_HANDLES.TOP)
    })
  })

  BddTest().when('updateNodeId is called to change a node ID', () => {
    const initialNode: Node = {
      id: 'node-1',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {},
    }
    const connectedEdge: Edge = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
    }
    const connectedEdge2: Edge = {
      id: 'edge-2',
      source: 'node-2',
      target: 'node-1',
    }
    const childNode: Node = {
      id: 'node-2',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: {},
      parentNode: 'node-1',
    }
    const newId = 'node-1-updated'

    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = [initialNode, childNode]
      mockEdges.value = [connectedEdge, connectedEdge2]
      composableResult.updateNodeId(initialNode.id, newId)
    })

    BddTest().then('it should update the node ID', () => {
      expect(mockUpdateNode).toHaveBeenCalledWith(initialNode.id, { id: newId })
    })

    BddTest().then('it should update edges connected to the node', () => {
      expect(mockUpdateEdge).toHaveBeenCalledWith(connectedEdge, { ...connectedEdge, source: newId })
      expect(mockUpdateEdge).toHaveBeenCalledWith(connectedEdge2, { ...connectedEdge2, target: newId })
    })

    BddTest().then('it should update child nodes referencing the node as parent', () => {
      expect(mockUpdateNode).toHaveBeenCalledWith(childNode.id, { parentNode: newId })
    })
  })

  BddTest().when('removeNode is called to remove a node', () => {
    const nodeToRemove: Node = {
      id: 'node-3',
      type: 'custom',
      position: { x: 50, y: 50 },
      data: {},
    }
    const nodeToKeep: Node = {
      id: 'node-4',
      type: 'custom',
      position: { x: 150, y: 150 },
      data: {},
    }
    const connectedEdge: Edge = {
      id: 'edge-3',
      source: 'node-3',
      target: 'node-4',
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = [nodeToRemove, nodeToKeep]
      mockEdges.value = [connectedEdge]
      composableResult.removeNode(nodeToRemove.id)
    })

    BddTest().then('it should remove the node by its ID', () => {
      expect(mockRemoveNodes).toHaveBeenCalledWith([nodeToRemove.id])
    })

    BddTest().then('it should remove connected edges', () => {
      expect(mockRemoveEdges).toHaveBeenCalledWith([connectedEdge])
    })
  })

  BddTest().when('removeNode is called with a non-existing node ID', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = []
      mockEdges.value = []
      composableResult.removeNode('non-existing-node')
    })

    BddTest().then('it should not attempt to remove any nodes or edges', () => {
      expect(mockRemoveNodes).not.toHaveBeenCalled()
      expect(mockRemoveEdges).not.toHaveBeenCalled()
    })
  })

  BddTest().when('removeNodeWithChildren is called to remove a node and its children', () => {
    const parentNode: Node = {
      id: 'node-5',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {},
    }
    const childNode: Node = {
      id: 'node-6',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: {},
      parentNode: 'node-5',
    }
    const grandChildNode: Node = {
      id: 'node-7',
      type: 'custom',
      position: { x: 200, y: 200 },
      data: {},
      parentNode: 'node-6',
    }
    const unconnectedNode: Node = {
      id: 'node-8',
      type: 'custom',
      position: { x: 300, y: 300 },
      data: {},
    }
    const childEdge: Edge = {
      id: 'edge-4',
      source: 'node-5',
      target: 'node-6',
    }
    const grandChildEdge: Edge = {
      id: 'edge-5',
      source: 'node-6',
      target: 'node-7',
    }
    const connectedEdge: Edge = {
      id: 'edge-6',
      source: 'node-8',
      target: 'node-5',
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = [parentNode, childNode, grandChildNode, unconnectedNode]
      mockEdges.value = [childEdge, grandChildEdge, connectedEdge]
      composableResult.removeNodeWithChildren(parentNode.id)
    })

    BddTest().then('it should remove the parent node and all its children recursively', () => {
      expect(mockRemoveNodes).toHaveBeenCalledWith([parentNode.id, childNode.id, grandChildNode.id])
    })

    BddTest().then('it should remove all connected edges', async () => {
      const removedEdges = mockRemoveEdges.mock.calls.flatMap(call => call[0])
      expect(removedEdges).toEqual(
        expect.arrayContaining([
          connectedEdge,
          childEdge,
          grandChildEdge,
        ])
      )
    })
  })

  BddTest().when('removeNodeWithChildren is called with a non-existing node ID', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = []
      mockEdges.value = []
      composableResult.removeNodeWithChildren('non-existing-node')
    })

    BddTest().then('it should not attempt to remove any nodes or edges', () => {
      expect(mockRemoveNodes).not.toHaveBeenCalled()
      expect(mockRemoveEdges).not.toHaveBeenCalled()
    })
  })

  BddTest().when('findNodeByTitleAndDescription is called', () => {
    const node1: Node = {
      id: 'node-9',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { title: 'Title 1', description: 'Description 1' },
    }
    const node2: Node = {
      id: 'node-10',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: { title: 'Title 2', description: 'Description 2' },
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = [node1, node2]
    })

    BddTest().then('it should find the node with matching title and description', () => {
      const foundNode = composableResult.findNodeByTitleAndDescription('Title 1', 'Description 1')
      expect(foundNode).toStrictEqual(node1)
    })

    BddTest().then('it should return undefined if no matching node is found', () => {
      const foundNode = composableResult.findNodeByTitleAndDescription('Non-existing Title', 'Non-existing Description')
      expect(foundNode).toBeUndefined()
    })
  })

  BddTest().when('findNodeByTitleAndDescription is called with multiple matching nodes', () => {
    const node1: Node = {
      id: 'node-11',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { title: 'Common Title', description: 'Common Description' },
    }
    const node2: Node = {
      id: 'node-12',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: { title: 'Common Title', description: 'Common Description' },
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = [node1, node2]
    })

    BddTest().then('it should return the first matching node', () => {
      const foundNode = composableResult.findNodeByTitleAndDescription('Common Title', 'Common Description')
      expect(foundNode).toStrictEqual(node1)
    })
  })

  BddTest().when('findNodeByTitleAndDescription is called with no nodes available', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = []
    })

    BddTest().then('it should return undefined', () => {
      const foundNode = composableResult.findNodeByTitleAndDescription('Any Title', 'Any Description')
      expect(foundNode).toBeUndefined()
    })
  })

  BddTest().when('toggle is called to collapse and expand a node', () => {
    const parentNode: Node = {
      id: 'node-13',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { collapsed: false },
    }
    const childNode: Node = {
      id: 'node-14',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: {},
      parentNode: 'node-13',
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = [parentNode, childNode]
    })

    BddTest().then('it should collapse the node and hide its children', () => {
      composableResult.toggle(parentNode.id)

      expect(mockUpdateNode).toHaveBeenCalledWith(parentNode.id, { data: { collapsed: true } })
      expect(mockUpdateNode).toHaveBeenCalledWith(childNode.id, { hidden: true })
    })
  })

  BddTest().when('toggle is called to expand a collapsed node', () => {
    const parentNode: Node = {
      id: 'node-15',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { collapsed: true },
    }
    const childNode: Node = {
      id: 'node-16',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: {},
      parentNode: 'node-15',
    }

    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = [parentNode, childNode]
    })

    BddTest().then('it should expand the node and show its children', () => {
      composableResult.toggle(parentNode.id)

      expect(mockUpdateNode).toHaveBeenCalledWith(parentNode.id, { data: { collapsed: false } })
      expect(mockUpdateNode).toHaveBeenCalledWith(childNode.id, { hidden: false })
    })
  })

  BddTest().when('toggle is called with a non-existing node ID', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mockNodes.value = []
      composableResult.toggle('non-existing-node')
    })

    BddTest().then('it should not attempt to update any nodes', () => {
      expect(mockUpdateNode).not.toHaveBeenCalled()
    })
  })
})
