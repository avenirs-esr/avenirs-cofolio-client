import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { PageTitleStub, QuerySuspenseStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedCguDTO } from '@/__mocks__/fixtures/cgu.fixtures'
import { getLatestCguErrorHandler } from '@/__mocks__/msw/handlers/cgu.handlers'
import { server } from '@/__mocks__/msw/server'
import { TermsOfServiceUpdateFormStub } from '@/features/terms-of-service/views/TermsOfServiceView/components/forms/TermsOfServiceUpdateForm/TermsOfServiceUpdateForm.stub'
import TermsOfServiceView from '@/features/terms-of-service/views/TermsOfServiceView/TermsOfServiceView.vue'

const TITLE = 'Conditions Générales d\'Utilisation'

BddTest().given('a terms of service view', () => {
  let wrapper: VueWrapper<InstanceType<typeof TermsOfServiceView>>

  const stubs = {
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    TermsOfServiceUpdateForm: TermsOfServiceUpdateFormStub,
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getForm = () => wrapper.findComponent(TermsOfServiceUpdateFormStub)

  const mountView = async () => {
    wrapper = mountComponent(TermsOfServiceView, {
      global: { stubs },
    })
    await vi.waitFor(() => {
      expect(getQuerySuspense().props('isLoading')).toBe(false)
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('the view is mounted', () => {
    beforeEach(async () => {
      await mountView()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().props('title')).toBe(TITLE)
    })

    BddTest().then('it should render QuerySuspense with the query state', () => {
      expect(getQuerySuspense().props()).toMatchObject({
        isLoading: false,
        error: null,
      })
    })

    BddTest().then('it should give the loaded cgu to the form', () => {
      expect(getForm().props('cgu')).toEqual(mockedCguDTO)
    })
  })

  BddTest().when('the query errors', () => {
    beforeEach(async () => {
      server.use(getLatestCguErrorHandler)
      wrapper = mountComponent(TermsOfServiceView, {
        global: { stubs },
      })
      await vi.waitFor(() => {
        expect(getQuerySuspense().props('isLoading')).toBe(false)
      })
    })

    BddTest().then('it should forward the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).not.toBeNull()
    })
  })
})
