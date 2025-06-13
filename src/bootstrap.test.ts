import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>()

  return {
    ...actual,
    createApp: vi.fn(() => ({
      use: vi.fn().mockReturnThis(),
      mount: vi.fn(),
    })),
  }
})

const mockCreateApp = vi.mocked(createApp)

describe('bootstrap.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call createApp and mount app', async () => {
    await import('@/main')

    expect(mockCreateApp).toHaveBeenCalledWith(expect.any(Object))

    const appMock = mockCreateApp.mock.results[0].value
    expect(appMock.use).toHaveBeenCalled()
    expect(appMock.mount).toHaveBeenCalledWith('#app')
  })
})
