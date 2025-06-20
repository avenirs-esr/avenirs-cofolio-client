import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

vi.mock('@/plugins/tanstack-query/tanstack-query')
vi.mock('@/plugins/vue-i18n/vue-i18n')
vi.mock('@/router')
vi.mock('@/store')
vi.mock('./App.vue', () => ({
  default: {
    name: 'MockedApp',
    template: '<div data-testid="mocked-app">Mocked App Component</div>'
  }
}))
vi.mock('vue', async () => {
  return {
    createApp: vi.fn(() => ({
      use: vi.fn().mockReturnThis(),
      mount: vi.fn(),
    })),
  }
})

vi.mock('@gouvfr/dsfr/dist/core/core.main.min.css')
vi.mock('@gouvfr/dsfr/dist/component/component.main.min.css')
vi.mock('@gouvfr/dsfr/dist/utility/utility.main.min.css')
vi.mock('@gouvminint/vue-dsfr/styles')
vi.mock('@gouvfr/dsfr/dist/scheme/scheme.min.css')
vi.mock('@gouvfr/dsfr/dist/utility/icons/icons.min.css')
vi.mock('@/assets/main.css')
vi.mock('@/ui/styles/main.scss')

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
