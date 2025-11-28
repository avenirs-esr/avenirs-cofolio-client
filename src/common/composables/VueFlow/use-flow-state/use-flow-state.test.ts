import type { Edge, Node } from '@vue-flow/core'
import { useFlowState } from '@/common/composables/VueFlow/use-flow-state/use-flow-state'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mockAddSuccessMessage } from 'tests/mocks'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockInitialNodes: Node[] = []
const mockInitialEdges: Edge[] = []
const mockNodes = ref<Node[]>([])
const mockEdges = ref<Edge[]>([])
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
      setNodes: mockSetNodes,
      setEdges: mockSetEdges
    }),
  }
})

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage
    })
  }
})

BddTest().given('an useFlowState composable', () => {
  let composableResult: ReturnType<typeof useFlowState>

  BddTest().and('initial nodes and edges are empty', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
      composableResult = mountComposable(() => useFlowState({ initialNodes: mockInitialNodes, initialEdges: mockInitialEdges }), { usePinia: true, useI18n: true }).result
    })

    BddTest().when('the composable is initialized', () => {
      BddTest().then('it should expose the requried methods', () => {
        expect(composableResult).toHaveProperty('saveCurrentState')
        expect(composableResult).toHaveProperty('restoreSavedState')
        expect(composableResult).toHaveProperty('resetToInitialState')
        expect(typeof composableResult.saveCurrentState).toBe('function')
        expect(typeof composableResult.restoreSavedState).toBe('function')
        expect(typeof composableResult.resetToInitialState).toBe('function')
      })
    })

    BddTest().when('saveCurrentState is called', () => {
      const prefix = 'testPrefix'
      const index = '1'

      beforeEach(() => {
        composableResult.saveCurrentState(prefix, index)
      })

      BddTest().then('it should save the current nodes and edges to local storage and show a success message', () => {
        expect(localStorage.getItem(`${prefix}-nodes-${index}`)).toBe(null)
        expect(localStorage.getItem(`${prefix}-edges-${index}`)).toBe(null)
        expect(mockAddSuccessMessage).toHaveBeenCalledWith({ description: `État sauvegardé avec succès dans l'emplacement ${index}.`, timeout: 2000 })
      })
    })

    BddTest().when('restoreSavedState is called with no saved state', () => {
      const prefix = 'nonExistentPrefix'
      const index = '99'

      beforeEach(() => {
        composableResult.restoreSavedState(prefix, index)
      })

      BddTest().then('it should reset to the initial nodes and edges', () => {
        expect(mockSetNodes).toHaveBeenCalledWith(mockInitialNodes)
        expect(mockSetEdges).toHaveBeenCalledWith(mockInitialEdges)
      })
    })

    BddTest().when('resetToInitialState is called', () => {
      beforeEach(() => {
        composableResult.resetToInitialState()
      })

      BddTest().then('it should reset to the initial nodes and edges', () => {
        expect(mockSetNodes).toHaveBeenCalledWith(mockInitialNodes)
        expect(mockSetEdges).toHaveBeenCalledWith(mockInitialEdges)
      })
    })
  })

  BddTest().and('initial nodes and edges are non-empty', () => {
    const nonEmptyInitialNodes: Node[] = [{ id: '1', position: { x: 0, y: 0 } }]
    const nonEmptyInitialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }]

    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
      composableResult = mountComposable(() => useFlowState({ initialNodes: nonEmptyInitialNodes, initialEdges: nonEmptyInitialEdges }), { usePinia: true, useI18n: true }).result
    })

    BddTest().when('saveCurrentState is called', () => {
      const prefix = 'testPrefix'
      const index = '2'

      beforeEach(() => {
        mockSetNodes([{ id: '2', position: { x: 100, y: 100 } }])
        mockSetEdges([{ id: 'e2-3', source: '2', target: '3' }])
        composableResult.saveCurrentState(prefix, index)
      })

      BddTest().then('it should save the current nodes and edges to local storage and show a success message', () => {
        expect(localStorage.getItem(`${prefix}-flow-nodes-${index}`)).toBe(JSON.stringify(mockNodes.value))
        expect(localStorage.getItem(`${prefix}-flow-edges-${index}`)).toBe(JSON.stringify(mockEdges.value))
        expect(mockAddSuccessMessage).toHaveBeenCalledWith({ description: `État sauvegardé avec succès dans l'emplacement ${index}.`, timeout: 2000 })
      })
    })

    BddTest().when('restoreSavedState is called with saved state', () => {
      const prefix = 'testPrefix'
      const index = '3'
      const savedNodes = [{ id: '3', position: { x: 200, y: 200 } }]
      const savedEdges = [{ id: 'e3-4', source: '3', target: '4' }]

      beforeEach(() => {
        localStorage.setItem(`${prefix}-flow-nodes-${index}`, JSON.stringify(savedNodes))
        localStorage.setItem(`${prefix}-flow-edges-${index}`, JSON.stringify(savedEdges))
        composableResult.restoreSavedState(prefix, index)
      })

      BddTest().then('it should restore the saved nodes and edges from local storage', () => {
        expect(mockSetNodes).toHaveBeenCalledWith(savedNodes)
        expect(mockSetEdges).toHaveBeenCalledWith(savedEdges)
      })
    })

    BddTest().when('resetToInitialState is called', () => {
      beforeEach(() => {
        composableResult.resetToInitialState()
      })

      BddTest().then('it should reset to the initial nodes and edges', () => {
        expect(mockSetNodes).toHaveBeenCalledWith(nonEmptyInitialNodes)
        expect(mockSetEdges).toHaveBeenCalledWith(nonEmptyInitialEdges)
      })
    })
  })
})
