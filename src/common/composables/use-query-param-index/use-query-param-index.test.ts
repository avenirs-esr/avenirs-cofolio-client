import { useQueryParamIndex } from '@/common/composables/use-query-param-index/use-query-param-index'
import { useQueryParam } from '@/common/composables/use-query-param/use-query-param'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

vi.mock('@/common/composables/use-query-param/use-query-param')

BddTest().given('a useQueryParamIndex composable', () => {
  const VALUES = ['first-tab', 'second-tab'] as const

  let router: ReturnType<typeof createRouter>
  let activeTab: ReturnType<typeof useQueryParamIndex>
  let setQueryParamValue: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    setQueryParamValue = vi.fn()
    vi.mocked(useQueryParam).mockReturnValue({ setQueryParamValue })

    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: {} }]
    })

    await router.push('/')

    await new Promise<void>((resolve) => {
      const app = createApp({
        setup () {
          activeTab = useQueryParamIndex(VALUES, 'tab')
          resolve()
          return () => null
        }
      })

      app.use(router)
      app.mount(document.createElement('div'))
    })
  })

  BddTest().when('values list is empty', () => {
    BddTest().then('it should throw', () => {
      expect(() => useQueryParamIndex([], 'tab'))
        .toThrow('useQueryParamIndex: values must not be empty')
    })
  })

  BddTest().when('no query param is set', () => {
    BddTest().then('it should return index 0 by default', () => {
      expect(activeTab.value).toBe(0)
    })
  })

  BddTest().when('query param matches a value', () => {
    BddTest().then('it should return the correct index', async () => {
      await router.push('/?tab=second-tab')

      await new Promise<void>((resolve) => {
        const app = createApp({
          setup () {
            activeTab = useQueryParamIndex(VALUES, 'tab')
            resolve()
            return () => null
          }
        })

        app.use(router)
        app.mount(document.createElement('div'))
      })

      expect(activeTab.value).toBe(1)
    })
  })

  BddTest().when('query param does not match any value', () => {
    BddTest().then('it should fallback to index 0', async () => {
      await router.push('/?tab=unknown')

      await new Promise<void>((resolve) => {
        const app = createApp({
          setup () {
            activeTab = useQueryParamIndex(VALUES, 'tab')
            resolve()
            return () => null
          }
        })

        app.use(router)
        app.mount(document.createElement('div'))
      })

      expect(activeTab.value).toBe(0)
    })
  })

  BddTest().when('setting index to 0', () => {
    BddTest().then('it should remove the query param', () => {
      activeTab.value = 0

      expect(setQueryParamValue).toHaveBeenCalledWith('tab', undefined)
    })
  })

  BddTest().when('setting index to 1', () => {
    BddTest().then('it should set the query param with the correct value', () => {
      activeTab.value = 1

      expect(setQueryParamValue).toHaveBeenCalledWith('tab', 'second-tab')
    })
  })

  BddTest().when('setting an invalid index', () => {
    BddTest().then('it should warn in DEV and do nothing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      activeTab.value = 999

      expect(warnSpy).toHaveBeenCalledWith('useQueryParamIndex: invalid index "999"')
      expect(setQueryParamValue).not.toHaveBeenCalled()

      warnSpy.mockRestore()
    })
  })

  BddTest().when('using a custom key', () => {
    BddTest().then('it should use the provided query param key', async () => {
      await new Promise<void>((resolve) => {
        const app = createApp({
          setup () {
            activeTab = useQueryParamIndex(VALUES, 'section')
            resolve()
            return () => null
          }
        })

        app.use(router)
        app.mount(document.createElement('div'))
      })

      activeTab.value = 1

      expect(setQueryParamValue).toHaveBeenCalledWith('section', 'second-tab')
    })
  })
})
