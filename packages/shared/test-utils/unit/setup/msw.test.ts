import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { setupMswLifecycle } from '@avenirs-esr/shared/test-utils'
import { beforeEach, expect, vi } from 'vitest'

type Hook = () => Promise<void>

function createHooks () {
  return {
    beforeAll: vi.fn<(callback: Hook) => void>(),
    afterEach: vi.fn<(callback: Hook) => void>(),
    afterAll: vi.fn<(callback: Hook) => void>(),
  }
}

function createServer () {
  return {
    listen: vi.fn<(options: { onUnhandledRequest: 'error' }) => void>(),
    resetHandlers: vi.fn<() => void>(),
    close: vi.fn<() => void>(),
  }
}

BddTest().given('the shared MSW lifecycle', () => {
  BddTest().when('the lifecycle is installed with local runner hooks', () => {
    const hooks = createHooks()
    const server = createServer()
    const loadServer = vi.fn(async () => ({ server }))

    beforeEach(() => {
      vi.clearAllMocks()
      setupMswLifecycle(hooks, loadServer)
    })

    BddTest().then('it registers each async hook in order without loading the server', () => {
      expect(hooks.beforeAll).toHaveBeenCalledOnce()
      expect(hooks.afterEach).toHaveBeenCalledOnce()
      expect(hooks.afterAll).toHaveBeenCalledOnce()
      expect(hooks.beforeAll.mock.invocationCallOrder[0]).toBeLessThan(hooks.afterEach.mock.invocationCallOrder[0])
      expect(hooks.afterEach.mock.invocationCallOrder[0]).toBeLessThan(hooks.afterAll.mock.invocationCallOrder[0])
      expect(loadServer).not.toHaveBeenCalled()
      expect(server.listen).not.toHaveBeenCalled()
      expect(server.resetHandlers).not.toHaveBeenCalled()
      expect(server.close).not.toHaveBeenCalled()
    })

    BddTest().and('each registered callback is executed', () => {
      beforeEach(async () => {
        await hooks.beforeAll.mock.calls[0][0]()
        await hooks.afterEach.mock.calls[0][0]()
        await hooks.afterAll.mock.calls[0][0]()
      })

      BddTest().then('it loads the local server for every phase and preserves listen reset close order', () => {
        expect(loadServer).toHaveBeenCalledTimes(3)
        expect(loadServer.mock.calls).toEqual([[], [], []])
        expect(server.listen).toHaveBeenCalledExactlyOnceWith({ onUnhandledRequest: 'error' })
        expect(server.resetHandlers).toHaveBeenCalledExactlyOnceWith()
        expect(server.close).toHaveBeenCalledExactlyOnceWith()
        expect(server.listen.mock.invocationCallOrder[0]).toBeLessThan(server.resetHandlers.mock.invocationCallOrder[0])
        expect(server.resetHandlers.mock.invocationCallOrder[0]).toBeLessThan(server.close.mock.invocationCallOrder[0])
      })
    })
  })

  for (const [phase, method] of [
    ['beforeAll', 'listen'],
    ['afterEach', 'resetHandlers'],
    ['afterAll', 'close'],
  ] as const) {
    BddTest().when(`${phase} is executed twice with different loaded servers`, () => {
      const hooks = createHooks()
      const firstServer = createServer()
      const secondServer = createServer()
      const loadServer = vi.fn<() => Promise<{ server: ReturnType<typeof createServer> }>>()

      beforeEach(async () => {
        vi.clearAllMocks()
        loadServer.mockResolvedValueOnce({ server: firstServer }).mockResolvedValueOnce({ server: secondServer })
        setupMswLifecycle(hooks, loadServer)
        await hooks[phase].mock.calls[0][0]()
        await hooks[phase].mock.calls[0][0]()
      })

      BddTest().then('it uses the server from each fresh load instead of caching a module', () => {
        expect(loadServer).toHaveBeenCalledTimes(2)
        expect(firstServer[method]).toHaveBeenCalledOnce()
        expect(secondServer[method]).toHaveBeenCalledOnce()
      })
    })

    BddTest().when(`${phase} receives a pending asynchronous server load`, () => {
      const hooks = createHooks()
      const server = createServer()
      const loadServer = vi.fn<() => Promise<{ server: typeof server }>>()
      let resolveServer: (module: { server: typeof server }) => void
      let completion: Promise<void>

      beforeEach(() => {
        vi.clearAllMocks()
        const pending = new Promise<{ server: typeof server }>((resolve) => {
          resolveServer = resolve
        })
        loadServer.mockReturnValueOnce(pending)
        setupMswLifecycle(hooks, loadServer)
        completion = hooks[phase].mock.calls[0][0]()
      })

      BddTest().then('it waits for the loader before invoking the matching method', async () => {
        expect(loadServer).toHaveBeenCalledExactlyOnceWith()
        expect(server[method]).not.toHaveBeenCalled()
        resolveServer({ server })
        await completion
        expect(server[method]).toHaveBeenCalledOnce()
      })
    })

    BddTest().when(`${phase} fails to load the local server`, () => {
      const hooks = createHooks()
      const error = new Error(`${phase} loader failed`)
      const loadServer = vi.fn<() => Promise<{ server: ReturnType<typeof createServer> }>>()

      beforeEach(() => {
        vi.clearAllMocks()
        loadServer.mockRejectedValueOnce(error)
        setupMswLifecycle(hooks, loadServer)
      })

      BddTest().then('it propagates the original asynchronous loader rejection', async () => {
        await expect(hooks[phase].mock.calls[0][0]()).rejects.toBe(error)
        expect(loadServer).toHaveBeenCalledExactlyOnceWith()
      })
    })

    BddTest().when(`${method} throws after the local server loads`, () => {
      const hooks = createHooks()
      const server = createServer()
      const error = new Error(`${method} failed`)
      const loadServer = vi.fn(async () => ({ server }))

      beforeEach(() => {
        vi.clearAllMocks()
        server[method].mockImplementationOnce(() => {
          throw error
        })
        setupMswLifecycle(hooks, loadServer)
      })

      BddTest().then('it rejects the async hook with the unchanged server error', async () => {
        await expect(hooks[phase].mock.calls[0][0]()).rejects.toBe(error)
        expect(server[method]).toHaveBeenCalledOnce()
      })
    })
  }
})
