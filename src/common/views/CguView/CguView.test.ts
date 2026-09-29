import type { VueWrapper } from '@vue/test-utils'
import { mockedCgu } from '@/__mocks__/fixtures/shared/cgu.fixtures'
import { cguQueryErrorHandler, cguQueryLoadingHandler } from '@/__mocks__/msw/handlers/shared/cgu.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import CguView from '@/common/views/CguView/CguView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, expect, vi } from 'vitest'

BddTest().given('a cgu view', () => {
  let wrapper: VueWrapper<InstanceType<typeof CguView>>

  const stubs = { PageTitle: PageTitleStub, QuerySuspense: QuerySuspenseStub }

  const title = 'Conditions générales d\'utilisation'

  const mountDefault = () => {
    wrapper = mountComponent(CguView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getVersion = () => wrapper.find('[data-testid="cgu-version"]')
  const getLastPublication = () => wrapper.find('[data-testid="cgu-last-publication"]')
  const getContent = () => wrapper.find('[data-testid="cgu-content"]')
  const getLoader = () => wrapper.find('[data-testid="query-suspense-loading"]')
  const getError = () => wrapper.find('[data-testid="query-suspense-error"]')

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('the latest cgu are loaded', () => {
    beforeEach(() => {
      mountDefault()
    })

    BddTest().then('it should render PageTitle with correct props', () => {
      expect(getPageTitle().props('title')).toBe(title)
      expect(getPageTitle().props('trailingLinks')).toEqual([{ text: title }])
    })

    BddTest().then('it should render the cgu version and its last publication date', async () => {
      await vi.waitFor(() => {
        expect(getVersion().text()).toBe(`Version ${mockedCgu.version}`)
      })
      expect(getLastPublication().text()).toBe('Dernière publication le 12 mars 2026')
    })

    BddTest().then('it should render the sanitized cgu content', async () => {
      await vi.waitFor(() => {
        expect(getContent().exists()).toBe(true)
      })
      expect(getContent().html()).toContain('Article 1 - Objet')
      expect(getError().exists()).toBe(false)
    })
  })

  BddTest().when('the latest cgu are loading', () => {
    beforeEach(() => {
      server.use(cguQueryLoadingHandler)
      mountDefault()
    })

    BddTest().then('it should render the loader', () => {
      expect(getLoader().exists()).toBe(true)
      expect(getContent().exists()).toBe(false)
    })
  })

  BddTest().when('the latest cgu fail to load', () => {
    beforeEach(() => {
      server.use(cguQueryErrorHandler)
      mountDefault()
    })

    BddTest().then('it should render the error message', async () => {
      await vi.waitFor(() => {
        expect(getError().exists()).toBe(true)
      })
      expect(getContent().exists()).toBe(false)
    })
  })
})
