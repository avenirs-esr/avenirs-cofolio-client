import { mockedTraceOverview } from '@/__mocks__/fixtures/student'
import { LongIconCardStub } from '@/common/components/cards/LongIconCard/LongIconCard.stub'
import TraceLongIconCard from '@/features/student/global/views/StudentHomeView/components/TraceLongIconCard/TraceLongIconCard.vue'
import { TraceAiProducedBadgeStub } from '@/features/student/traces/components/badges/TraceAiProducedBadge/TraceAiProducedBadge.stub'
import { TraceAuthorTypeBadgeStub } from '@/features/student/traces/components/badges/TraceAuthorTypeBadge/TraceAuthorTypeBadge.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'

BddTest().given('a trace long icon card', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceLongIconCard>>

  const props = { trace: mockedTraceOverview[0] }

  const stubs = {
    LongIconCard: LongIconCardStub,
    TraceAuthorTypeBadge: TraceAuthorTypeBadgeStub,
    TraceAiProducedBadge: TraceAiProducedBadgeStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(TraceLongIconCard, {
        props,
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render the LongIconCard component', () => {
      const longIconCard = wrapper.findComponent({ name: 'LongIconCard' })
      expect(longIconCard.exists()).toBe(true)
    })

    BddTest().then('it should render the trace title as LongIconCard title', () => {
      expect(wrapper.findComponent(LongIconCardStub).props('title')).toBe(props.trace.title)
    })

    BddTest().then('it should render the trace author type badge', () => {
      expect(wrapper.findComponent(TraceAuthorTypeBadgeStub).exists()).toBe(true)
    })

    BddTest().then('it should render the trace AI produced badge', () => {
      expect(wrapper.findComponent(TraceAiProducedBadgeStub).exists()).toBe(true)
    })
  })
})
