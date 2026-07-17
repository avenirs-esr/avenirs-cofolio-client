import type { TraceFilter, TracesViewParams } from '@/api/avenir-esr'
import { createMockedTracesViewResponse } from '@/__mocks__/fixtures/student'
import { createTracesViewHandler, tracesViewErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { ValorizedElementsCardContainerStub } from '@/features/student/kit/components/cards/ValorizedElementsCardContainer/ValorizedElementsCardContainer.stub'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import { TraceValorizedItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/TraceValorizedItem/TraceValorizedItem.stub'
import ValorizedAssociatedTracesContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedAssociatedTracesContainer/ValorizedAssociatedTracesContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a valorized associated traces container', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedAssociatedTracesContainer>>
  let requestedTraceFilter: TraceFilter
  let requestedParams: TracesViewParams

  const stubs = {
    ValorizedElementsCardContainer: ValorizedElementsCardContainerStub,
    TraceValorizedItem: TraceValorizedItemStub
  }

  const mountAssociatedTracesContainer = async () => {
    wrapper = mountComponent(ValorizedAssociatedTracesContainer, { global: { stubs } })
    await flushPromises()
  }

  BddTest().when('the traces view request succeeds with 3 traces', () => {
    const mockedTracesData = createMockedTracesViewResponse({ isAssociated: true, isValorized: true }, { pageSize: 100 }, 3)

    beforeEach(async () => {
      server.use(createTracesViewHandler(mockedTracesData, (traceFilter, params) => {
        requestedTraceFilter = traceFilter
        requestedParams = params
      }))

      await mountAssociatedTracesContainer()
    })

    BddTest().then('it should fetch traces with isAssociated true, isValorized true and pageSize 100', () => {
      expect(requestedTraceFilter).toEqual({ isAssociated: true, isValorized: true })
      expect(requestedParams.pageSize).toBe(100)
    })

    BddTest().then('it should render the title with the total elements count', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.exists()).toBe(true)
      expect(container.props('title')).toBe('Mes traces associées (3)')
    })

    BddTest().then('it should not be loading and have no error once fetched', () => {
      const container = wrapper.findComponent(ValorizedElementsCardContainerStub)
      expect(container.props('isLoading')).toBe(false)
      expect(container.props('error')).toBe(null)
    })

    BddTest().then('it should render one TraceValorizedItem per trace with ASSOCIATED_TRACE type', () => {
      const items = wrapper.findAllComponents(TraceValorizedItemStub)
      expect(items).toHaveLength(3)
      mockedTracesData.data.forEach((trace, index) => {
        expect(items[index].props('trace')).toEqual(trace)
      })
      items.forEach((item) => {
        expect(item.props('type')).toBe(ValorizedItemType.ASSOCIATED_TRACE)
      })
    })
  })

  BddTest().when('the traces view request succeeds with a single trace', () => {
    const mockedTracesData = createMockedTracesViewResponse({ isAssociated: true, isValorized: true }, { pageSize: 100 }, 1)

    beforeEach(async () => {
      server.use(createTracesViewHandler(mockedTracesData))

      await mountAssociatedTracesContainer()
    })

    BddTest().then('it should render the title in the singular form', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('title')).toBe('Ma trace associée (1)')
    })

    BddTest().then('it should render a single TraceValorizedItem', () => {
      const items = wrapper.findAllComponents(TraceValorizedItemStub)
      expect(items).toHaveLength(1)
    })
  })

  BddTest().when('the traces view request succeeds with 0 traces', () => {
    const mockedTracesData = createMockedTracesViewResponse({ isAssociated: true, isValorized: true }, { pageSize: 100 }, 0)

    beforeEach(async () => {
      server.use(createTracesViewHandler(mockedTracesData))

      await mountAssociatedTracesContainer()
    })

    BddTest().then('it should render no TraceValorizedItem', () => {
      expect(wrapper.findAllComponents(TraceValorizedItemStub)).toHaveLength(0)
    })
  })

  BddTest().when('the traces view request fails', () => {
    beforeEach(async () => {
      server.use(tracesViewErrorHandler)

      await mountAssociatedTracesContainer()
    })

    BddTest().then('it should forward the error to the card container', () => {
      expect(wrapper.findComponent(ValorizedElementsCardContainerStub).props('error')).toBeTruthy()
    })
  })
})
