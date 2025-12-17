import type { Edge, Node } from '@vue-flow/core'
import { useEdges } from '@/common/composables/VueFlow/use-edges/use-edges'
import { getEdgeId } from '@/common/utils/vue-flow/vue-flow'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const edgesMock = ref<Edge[]>([])
const nodesMock = ref<Node[]>([])
const addEdgesMock = vi.fn()

vi.mock('@vue-flow/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vue-flow/core')>()
  return {
    ...actual,
    useVueFlow: () => ({
      edges: edgesMock,
      nodes: nodesMock,
      addEdges: addEdgesMock,
    }),
  }
})

BddTest().given('an useEdges composable', () => {
  const flowId = 'test-flow'

  BddTest().when('the composable is initialized', () => {
    let composableResult: ReturnType<typeof useEdges>

    beforeEach(() => {
      vi.clearAllMocks()
      edgesMock.value = []
      nodesMock.value = []
      composableResult = mountComposable(() => useEdges(flowId), { usePinia: true }).result
    })

    BddTest().then('it should expose required properties and methods', () => {
      expect(composableResult).toHaveProperty('onConnect')
      expect(typeof composableResult.onConnect).toBe('function')
    })

    BddTest().and('onConnect is called with a null source handle', () => {
      beforeEach(() => {
        composableResult.onConnect({ source: 'node-1', target: 'node-2', sourceHandle: null, targetHandle: 'handle-2' })
      })

      BddTest().then('it should not add a new edge', () => {
        expect(addEdgesMock).not.toHaveBeenCalled()
      })
    })

    BddTest().and('onConnect is called with a null target handle', () => {
      beforeEach(() => {
        composableResult.onConnect({ source: 'node-1', target: 'node-2', sourceHandle: 'handle-1', targetHandle: null })
      })

      BddTest().then('it should not add a new edge', () => {
        expect(addEdgesMock).not.toHaveBeenCalled()
      })
    })

    BddTest().and('onConnect is called with a valid connection', () => {
      const connection = { source: 'node-1', target: 'node-2', sourceHandle: 'handle-1', targetHandle: 'handle-2' }

      beforeEach(() => {
        edgesMock.value = []
        nodesMock.value = []
        composableResult.onConnect(connection)
      })

      BddTest().then('it should add a new edge', () => {
        expect(addEdgesMock).toHaveBeenCalledTimes(1)
        expect(addEdgesMock).toHaveBeenCalledWith([
          expect.objectContaining({
            ...connection,
            type: 'smoothstep',
            id: expect.any(String),
          }),
        ])
      })
    })

    BddTest().and('onConnect is called with a duplicate connection', () => {
      const connection = { source: 'node-1', target: 'node-2', sourceHandle: 'handle-1', targetHandle: 'handle-2' }
      const existingEdge = { ...connection, type: 'smoothstep', id: getEdgeId(connection) }

      beforeEach(() => {
        edgesMock.value = [existingEdge]
        composableResult.onConnect(connection)
      })

      BddTest().then('it should not add a new edge', () => {
        expect(addEdgesMock).not.toHaveBeenCalled()
      })
    })
  })
})
