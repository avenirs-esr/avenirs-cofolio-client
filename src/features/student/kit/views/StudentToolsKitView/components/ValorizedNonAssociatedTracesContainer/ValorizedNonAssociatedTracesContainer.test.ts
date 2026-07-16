import type { PagedResponseTraceViewDTO, TraceFilter, TracesViewParams } from '@/api/avenir-esr'
import { createTracesViewHandler, tracesViewErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { ValorizedElementsCardContainerStub } from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.stub'
import ValorizedNonAssociatedTracesContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedNonAssociatedTracesContainer/ValorizedNonAssociatedTracesContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a valorized non associated traces container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedNonAssociatedTracesContainer>>
  let requestedTraceFilter: TraceFilter
  let requestedParams: TracesViewParams

  const stubs = {
    ValorizedElementsCardContainer: ValorizedElementsCardContainerStub
  }

  const mountNonAssociatedTracesContainer = async () => {
    wrapper = mountComponent(ValorizedNonAssociatedTracesContainer, { global: { stubs } })
    await flushPromises()
  }

  BddTest().when('the traces view request succeeds with 0 traces', () => {
    beforeEach(async () => {
      const mockedTracesData: PagedResponseTraceViewDTO = {
        data: [],
        page: { page: 0, pageSize: 100, totalElements: 0, totalPages: 0 }
      }

      server.use(createTracesViewHandler(mockedTracesData, (traceFilter, params) => {
        requestedTraceFilter = traceFilter
        requestedParams = params
      }))

      await mountNonAssociatedTracesContainer()
    })

    BddTest().then('it should fetch traces with isAssociated false, isValorized true and pageSize 100', () => {
      expect(requestedTraceFilter).toEqual({ isAssociated: false, isValorized: true })
      expect(requestedParams.pageSize).toBe(100)
    })

    BddTest().then('it should render the title in the plural form with a 0 count', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Mes traces non associées (0)')
    })

    BddTest().then('it should not be loading and have no error once fetched', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.props('isLoading')).toBe(false)
      expect(container.props('error')).toBe(null)
    })

    BddTest().then('it should render the placeholder body', () => {
      expect(wrapper.find('[data-testid="valorized-non-associated-traces-container-placeholder"]').exists()).toBe(true)
    })
  })

  BddTest().when('the traces view request succeeds with 5 traces', () => {
    beforeEach(async () => {
      const mockedTracesData: PagedResponseTraceViewDTO = {
        data: [],
        page: { page: 0, pageSize: 100, totalElements: 5, totalPages: 1 }
      }
      server.use(createTracesViewHandler(mockedTracesData))

      await mountNonAssociatedTracesContainer()
    })

    BddTest().then('it should render the title in the plural form', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Mes traces non associées (5)')
    })
  })

  BddTest().when('the traces view request succeeds with 1 trace', () => {
    beforeEach(async () => {
      const mockedTracesData: PagedResponseTraceViewDTO = {
        data: [],
        page: { page: 0, pageSize: 100, totalElements: 1, totalPages: 1 }
      }
      server.use(createTracesViewHandler(mockedTracesData))

      await mountNonAssociatedTracesContainer()
    })

    BddTest().then('it should render the title in the singular form', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Ma trace non associée (1)')
    })
  })

  BddTest().when('the traces view request fails', () => {
    beforeEach(async () => {
      server.use(tracesViewErrorHandler)

      await mountNonAssociatedTracesContainer()
    })

    BddTest().then('it should forward the error to the card container', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('error')).toBeTruthy()
    })
  })
})
