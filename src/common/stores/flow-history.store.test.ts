import { type FlowHistoryStack, useFlowHistoryStore } from '@/common/stores/flow-history.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect } from 'vitest'

BddTest().given('a flow history store', () => {
  let store: ReturnType<typeof useFlowHistoryStore>

  BddTest().when('the store is initialized', () => {
    beforeEach(() => {
      setActivePinia(createPinia())
      store = useFlowHistoryStore()
    })

    BddTest().then('the store should be defined', () => {
      expect(store).toBeDefined()
    })

    BddTest().then('the sotre should expose the correct methods', () => {
      expect(store.canUndo).toBeDefined()
      expect(store.canRedo).toBeDefined()
      expect(store.saveSnapshot).toBeDefined()
      expect(store.undo).toBeDefined()
      expect(store.redo).toBeDefined()
    })

    BddTest().and('saving a snapshot', () => {
      const flowId = 'test-flow'
      const nodes = [{ id: '1', type: 'input', position: { x: 0, y: 0 } }] as FlowHistoryStack['nodes']
      const edges = [] as FlowHistoryStack['edges']

      beforeEach(() => {
        store.saveSnapshot(flowId, nodes, edges)
      })

      BddTest().then('the undo stack should have one entry', () => {
        expect(store.canUndo(flowId)).toBe(true)
      })

      BddTest().then('the redo stack should be empty', () => {
        expect(store.canRedo(flowId)).toBe(false)
      })
    })

    BddTest().and('undoing a snapshot', () => {
      const flowId = 'test-flow-undo'
      const nodes1 = [{ id: '1', type: 'input', position: { x: 0, y: 0 } }] as FlowHistoryStack['nodes']
      const edges1 = [] as FlowHistoryStack['edges']
      const nodes2 = [{ id: '2', type: 'input', position: { x: 100, y: 100 } }] as FlowHistoryStack['nodes']
      const edges2 = [] as FlowHistoryStack['edges']
      let currentNodes = nodes2
      let currentEdges = edges2

      const setNodes = (nodes: FlowHistoryStack['nodes']) => {
        currentNodes = nodes
      }

      const setEdges = (edges: FlowHistoryStack['edges']) => {
        currentEdges = edges
      }

      beforeEach(() => {
        store.saveSnapshot(flowId, nodes1, edges1)
        store.saveSnapshot(flowId, nodes2, edges2)
        store.undo(flowId, currentNodes, currentEdges, setNodes, setEdges)
      })

      BddTest().then('the redo stack should have one entry', () => {
        expect(store.canRedo(flowId)).toBe(true)
      })
    })

    BddTest().and('redoing a snapshot', () => {
      const flowId = 'test-flow-redo'
      const nodes1 = [{ id: '1', type: 'input', position: { x: 0, y: 0 } }] as FlowHistoryStack['nodes']
      const edges1 = [] as FlowHistoryStack['edges']
      const nodes2 = [{ id: '2', type: 'input', position: { x: 100, y: 100 } }] as FlowHistoryStack['nodes']
      const edges2 = [] as FlowHistoryStack['edges']
      let currentNodes = nodes1
      let currentEdges = edges1

      const setNodes = (nodes: FlowHistoryStack['nodes']) => {
        currentNodes = nodes
      }

      const setEdges = (edges: FlowHistoryStack['edges']) => {
        currentEdges = edges
      }

      beforeEach(() => {
        store.saveSnapshot(flowId, nodes1, edges1)
        store.saveSnapshot(flowId, nodes2, edges2)
        store.undo(flowId, currentNodes, currentEdges, setNodes, setEdges)
        store.redo(flowId, currentNodes, currentEdges, setNodes, setEdges)
      })

      BddTest().then('the redo stack should be empty', () => {
        expect(store.canRedo(flowId)).toBe(false)
      })
    })

    BddTest().and('checking undo availability on a new flow', () => {
      const flowId = 'new-flow'

      BddTest().then('canUndo should return false', () => {
        expect(store.canUndo(flowId)).toBe(false)
      })

      BddTest().then('trying to undo should do nothing', () => {
        const nodes = [] as FlowHistoryStack['nodes']
        const edges = [] as FlowHistoryStack['edges']
        const setNodes = (_nodes: FlowHistoryStack['nodes']) => { }
        const setEdges = (_edges: FlowHistoryStack['edges']) => { }

        store.undo(flowId, nodes, edges, setNodes, setEdges)

        expect(store.canUndo(flowId)).toBe(false)
      })
    })

    BddTest().and('checking redo availability on a new flow', () => {
      const flowId = 'new-flow-redo'

      BddTest().then('canRedo should return false', () => {
        expect(store.canRedo(flowId)).toBe(false)
      })

      BddTest().then('trying to redo should do nothing', () => {
        const nodes = [] as FlowHistoryStack['nodes']
        const edges = [] as FlowHistoryStack['edges']
        const setNodes = (_nodes: FlowHistoryStack['nodes']) => { }
        const setEdges = (_edges: FlowHistoryStack['edges']) => { }

        store.redo(flowId, nodes, edges, setNodes, setEdges)

        expect(store.canRedo(flowId)).toBe(false)
      })
    })
  })
})
