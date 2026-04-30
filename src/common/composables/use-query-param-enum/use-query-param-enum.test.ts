import { useQueryParamEnum } from '@/common/composables/use-query-param-enum/use-query-param-enum'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

enum Tabs {
  FIRST_TAB = 0,
  SECOND_TAB = 1
}

BddTest().given('a useQueryParamEnum composable (enum <-> query param mapping)', () => {
  let router: ReturnType<typeof createRouter>
  let activeTab: ReturnType<typeof useQueryParamEnum<typeof Tabs>>

  async function mountWithRoute (url = '/') {
    await router.push(url)
    await router.isReady()

    await new Promise<void>((resolve) => {
      const app = createApp({
        setup () {
          activeTab = useQueryParamEnum(Tabs, 'tab')
          resolve()
          return () => null
        }
      })
      app.use(router)
      app.mount(document.createElement('div'))
    })
  }

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: {} }]
    })
    await mountWithRoute('/')
  })

  BddTest().when('enum is empty', () => {
    BddTest().then('it should throw', async () => {
      await expect(async () => {
        await new Promise<void>((resolve, reject) => {
          const app = createApp({
            setup () {
              try {
                useQueryParamEnum({}, 'tab')
                resolve()
              }
              catch (e) {
                reject(e)
              }
              return () => null
            }
          })
          app.use(router)
          app.mount(document.createElement('div'))
        })
      }).rejects.toThrow('useQueryParamEnum: enum must not be empty')
    })
  })

  BddTest().when('no query param is set', () => {
    BddTest().then('it should return the default enum value (FIRST_TAB)', () => {
      expect(activeTab.value).toBe(Tabs.FIRST_TAB)
    })
  })

  BddTest().when('query param matches a value', () => {
    BddTest().then('it should return the matching enum value', async () => {
      await mountWithRoute('/?tab=second-tab')
      expect(activeTab.value).toBe(Tabs.SECOND_TAB)
    })
  })

  BddTest().when('query param does not match any value', () => {
    BddTest().then('it should fallback to the default enum value', async () => {
      await mountWithRoute('/?tab=unknown')
      expect(activeTab.value).toBe(Tabs.FIRST_TAB)
    })
  })

  BddTest().when('setting value to FIRST_TAB', () => {
    BddTest().then('it should remove the query param (default value not serialized)', async () => {
      activeTab.value = Tabs.SECOND_TAB
      await flushPromises()

      activeTab.value = Tabs.FIRST_TAB
      await flushPromises()

      expect(router.currentRoute.value.query.tab).toBeUndefined()
    })
  })

  BddTest().when('setting value to SECOND_TAB', () => {
    BddTest().then('it should serialize the enum key to kebab-case in the query param', async () => {
      activeTab.value = Tabs.SECOND_TAB
      await flushPromises()

      expect(router.currentRoute.value.query.tab).toBe('second-tab')
    })
  })

  BddTest().when('setting an invalid enum value', () => {
    BddTest().then('it should throw', () => {
      expect(() => {
        activeTab.value = 999 as any
      }).toThrow('useQueryParamEnum: invalid value "999"')
    })
  })

  BddTest().when('using a custom query param name', () => {
    BddTest().then('it should use the provided query param name', async () => {
      await new Promise<void>((resolve) => {
        const app = createApp({
          setup () {
            activeTab = useQueryParamEnum(Tabs, 'section')
            resolve()
            return () => null
          }
        })
        app.use(router)
        app.mount(document.createElement('div'))
      })

      activeTab.value = Tabs.SECOND_TAB
      await flushPromises()

      expect(router.currentRoute.value.query.section).toBe('second-tab')
    })
  })
})
