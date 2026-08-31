import type { VueWrapper } from '@vue/test-utils'
import TraceAiProducedBadge from '@/features/traces/components/badges/TraceAiProducedBadge/TraceAiProducedBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a trace AI produced badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAiProducedBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  BddTest().when('the trace is AI produced', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAiProducedBadge, {
        props: { aiProduced: true },
        global: { stubs }
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

  BddTest().when('the trace is not AI produced', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAiProducedBadge, {
        props: { aiProduced: false },
        global: { stubs }
      })
    })

    BddTest().then('it should render the "Sans IA" label', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('Sans IA')
    })

    BddTest().then('it should use the surface background and skill card border colors', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('backgroundColor')).toBe('var(--surface-background)')
      expect(badge.props('borderColor')).toBe('var(--other-border-skill-card)')
    })
  })
})
