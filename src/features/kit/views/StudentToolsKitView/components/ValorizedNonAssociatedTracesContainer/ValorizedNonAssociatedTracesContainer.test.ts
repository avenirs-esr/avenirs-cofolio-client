import type { TraceFilter, TracesViewParams } from '@/api/avenir-esr'
import { createMockedTracesViewResponse } from '@/__mocks__/fixtures/student'
import { createTracesViewHandler, tracesViewErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { ValorizedElementsCardContainerStub } from '@/features/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.stub'
import { ValorizedItemType } from '@/features/kit/types/valorized.types'
import { TraceValorizedItemStub } from '@/features/kit/views/StudentToolsKitView/components/TraceValorizedItem/TraceValorizedItem.stub'
import ValorizedNonAssociatedTracesContainer from '@/features/kit/views/StudentToolsKitView/components/ValorizedNonAssociatedTracesContainer/ValorizedNonAssociatedTracesContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a valorized non associated traces container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedNonAssociatedTracesContainer>>
  let requestedTraceFilter: TraceFilter
  let requestedParams: TracesViewParams

  const stubs = {
    ValorizedElementsCardContainer: ValorizedElementsCardContainerStub,
    TraceValorizedItem: TraceValorizedItemStub
  }

  const mountNonAssociatedTracesContainer = async () => {
    wrapper = mountComponent(ValorizedNonAssociatedTracesContainer, { global: { stubs } })
    await flushPromises()
  }

  BddTest().when('the traces view request succeeds with 0 traces', () => {
    const mockedTracesData = createMockedTracesViewResponse({ isAssociated: false, isValorized: true }, { pageSize: 100 }, 0)

    beforeEach(async () => {
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

    BddTest().then('it should render no TraceValorizedItem', () => {
      expect(wrapper.findAllComponents(TraceValorizedItemStub)).toHaveLength(0)
    })
  })

  BddTest().when('the traces view request succeeds with 2 traces', () => {
    const mockedTracesData = createMockedTracesViewResponse({ isAssociated: false, isValorized: true }, { pageSize: 100 }, 2)

    beforeEach(async () => {
      server.use(createTracesViewHandler(mockedTracesData))

      await mountNonAssociatedTracesContainer()
    })

    BddTest().then('it should render the title in the plural form', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Mes traces non associées (2)')
    })

    BddTest().then('it should render one TraceValorizedItem per trace with NON_ASSOCIATED_TRACE type', () => {
      const items = wrapper.findAllComponents(TraceValorizedItemStub)
      expect(items).toHaveLength(2)
      mockedTracesData.data.forEach((trace, index) => {
        expect(items[index].props('trace')).toEqual(trace)
      })
      items.forEach((item) => {
        expect(item.props('type')).toBe(ValorizedItemType.NON_ASSOCIATED_TRACE)
      })
    })
  })

  BddTest().when('the traces view request succeeds with 1 trace', () => {
    const mockedTracesData = createMockedTracesViewResponse({ isAssociated: false, isValorized: true }, { pageSize: 100 }, 1)

    beforeEach(async () => {
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
