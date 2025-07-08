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

vi.mock('@/__mocks__/msw/browser', () => ({
  worker: {
    start: vi.fn().mockResolvedValue(undefined)
  }
}))

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

  describe('given main.ts is imported in production environment', () => {
    beforeEach(() => {
      Object.defineProperty(import.meta, 'env', {
        value: { PROD: true },
        writable: true,
        configurable: true
      })
      vi.stubGlobal('__ENABLE_MSW__', false)
    })

    describe('when the module is loaded', () => {
      beforeEach(async () => {
        await import('@/main')
      })

      it('then should call createVueApp and mount app without MSW', () => {
        expect(mockCreateApp).toHaveBeenCalledWith(expect.any(Object))
        const appMock = mockCreateApp.mock.results[0].value
        expect(appMock.use).toHaveBeenCalled()
        expect(appMock.mount).toHaveBeenCalledWith('#app')
      })
    })
  })

  describe('given main.ts is imported in development environment with MSW enabled', () => {
    const mockWorkerStart = vi.fn().mockResolvedValue(undefined)

    beforeEach(() => {
      Object.defineProperty(import.meta, 'env', {
        value: { PROD: false },
        writable: true,
        configurable: true
      })
      vi.stubGlobal('__ENABLE_MSW__', true)

      vi.doMock('@/__mocks__/msw/browser', () => ({
        worker: {
          start: mockWorkerStart
        }
      }))
    })

    describe('when the module is loaded', () => {
      beforeEach(async () => {
        vi.resetModules()
        await import('@/main')
      })

      it('then should start MSW worker before mounting app', () => {
        const basePath = import.meta.env.VITE_BASE_PATH || '/cofolio/'
        expect(mockWorkerStart).toHaveBeenCalledWith({
          onUnhandledRequest: 'bypass',
          serviceWorker: {
            url: `${basePath}mockServiceWorker.js`
          }
        })
        expect(mockCreateApp).toHaveBeenCalledWith(expect.any(Object))
        const appMock = mockCreateApp.mock.results[0].value
        expect(appMock.mount).toHaveBeenCalledWith('#app')
      })
    })
  })

  describe('given main.ts is imported in development environment with MSW disabled', () => {
    beforeEach(() => {
      Object.defineProperty(import.meta, 'env', {
        value: { PROD: false },
        writable: true,
        configurable: true
      })
      vi.stubGlobal('__ENABLE_MSW__', false)
    })

    describe('when the module is loaded', () => {
      beforeEach(async () => {
        vi.resetModules()
        await import('@/main')
      })

      it('then should mount app without starting MSW', () => {
        expect(mockCreateApp).toHaveBeenCalledWith(expect.any(Object))
        const appMock = mockCreateApp.mock.results[0].value
        expect(appMock.use).toHaveBeenCalled()
        expect(appMock.mount).toHaveBeenCalledWith('#app')
      })
    })
  })

  describe('given createVueApp is called directly', () => {
    let result: ReturnType<typeof createApp>

    describe('when createVueApp is invoked', () => {
      beforeEach(async () => {
        const { createVueApp } = await import('@/bootstrap')
        result = createVueApp()
      })

      it('then should create app with correct configuration', () => {
        expect(mockCreateApp).toHaveBeenCalledWith(expect.any(Object))
        expect(result.use).toHaveBeenCalled()
      })

      it('then should register all required plugins', () => {
        const appMock = mockCreateApp.mock.results[0].value
        expect(appMock.use).toHaveBeenCalledTimes(4) // store, router, tanstackQuery, i18nAvPlugin
      })
    })
  })
})
