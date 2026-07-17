import type { VueWrapper } from '@vue/test-utils'
import TraceAiProducedBadge from '@/features/student/traces/components/badges/TraceAiProducedBadge/TraceAiProducedBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a trace AI produced badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAiProducedBadge>>

  beforeEach(() => {
    wrapper = mountComponent(TraceAiProducedBadge, {
      global: { stubs: { AvBadge: AvBadgeStub } }
    })
  })

  BddTest().then('it should render the "Avec IA" label', () => {
    expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('Avec IA')
  })

  BddTest().then('it should use the critical foreground background and contrast text color', () => {
    const badge = wrapper.findComponent(AvBadgeStub)
    expect(badge.props('backgroundColor')).toBe('var(--light-foreground-critical)')
    expect(badge.props('color')).toBe('var(--contrast-foreground)')
  })

  BddTest().then('it should not have a border', () => {
    expect(wrapper.findComponent(AvBadgeStub).props('borderColor')).toBe('transparent')
  })
})
