import type { VueWrapper } from '@vue/test-utils'
import { ETraceAuthorType } from '@/api/avenir-esr'
import TraceAuthorTypeBadge from '@/features/traces/components/badges/TraceAuthorTypeBadge/TraceAuthorTypeBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a trace author type badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAuthorTypeBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  BddTest().when('the author type is PERSONAL', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAuthorTypeBadge, {
        props: { authorType: ETraceAuthorType.PERSONAL },
        global: { stubs }
      })
    })

    BddTest().then('it should render the translated label', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('Individuel')
    })
  })

  BddTest().when('the author type is COLLECTIVE', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAuthorTypeBadge, {
        props: { authorType: ETraceAuthorType.COLLECTIVE },
        global: { stubs }
      })
    })

    BddTest().then('it should render the translated label', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('Collectif')
    })
  })

  BddTest().when('the author type is THIRD_PARTY', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAuthorTypeBadge, {
        props: { authorType: ETraceAuthorType.THIRD_PARTY },
        global: { stubs }
      })
    })

    BddTest().then('it should render the translated label', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('Témoignage / Recommandation')
    })

    BddTest().then('it should use the card background and skill card border colors', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('backgroundColor')).toBe('var(--card)')
      expect(badge.props('borderColor')).toBe('var(--other-border-skill-card)')
    })
  })
})
