interface MswServer {
  listen: (options: { onUnhandledRequest: 'error' }) => void
  resetHandlers: () => void
  close: () => void
}

interface MswLifecycleHooks {
  beforeAll: (callback: () => Promise<void>) => void
  afterEach: (callback: () => Promise<void>) => void
  afterAll: (callback: () => Promise<void>) => void
}

export function setupMswLifecycle (
  { beforeAll, afterEach, afterAll }: MswLifecycleHooks,
  loadServer: () => Promise<{ server: MswServer }>,
) {
  beforeAll(async () => {
    const { server } = await loadServer()
    server.listen({
      onUnhandledRequest: 'error',
    })
  })

  afterEach(async () => {
    const { server } = await loadServer()
    server.resetHandlers()
  })

  afterAll(async () => {
    const { server } = await loadServer()
    server.close()
  })
}
