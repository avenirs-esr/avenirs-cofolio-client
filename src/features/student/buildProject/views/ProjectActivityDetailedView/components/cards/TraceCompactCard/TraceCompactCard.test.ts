import type { VueWrapper } from '@vue/test-utils'
import TraceCompactCard, {
  type TraceCompactCardProps
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceCompactCard/TraceCompactCard.vue'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { ICONS } from '@/features/student/global/icons'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a trace compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceCompactCard>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub
  }

  const props: TraceCompactCardProps = {
    trace: {
      id: 'trace-1',
      title: 'Trace Title'
    }
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceCompactCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the floating icon card', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should pass the trace title to the floating icon card', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.props('title')).toBe('Trace Title')
    })

    BddTest().then('it should pass the correct color to the floating icon card', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.props('color')).toBe('var(--light-background-neutral)')
    })

    BddTest().then('it should pass the correct header rows to the floating icon card', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.props('headerRows')).toBe(2)
    })

    BddTest().then('it should pass the correct height to the floating icon card', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.props('height')).toBe('7.5rem')
    })

    BddTest().then('it should pass the correct title typography classes to the floating icon card', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.props('titleTypographyClasses')).toBe('caption-regular')
    })

    BddTest().then('it should pass the traces icon options to the floating icon card', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.props('iconOptions')).toEqual({
        name: ICONS.TRACES,
        color: 'var(--icon)',
        bottom: '-2.5rem',
        borderColor: 'var(--other-border-skill-card)'
      })
    })
  })
})
