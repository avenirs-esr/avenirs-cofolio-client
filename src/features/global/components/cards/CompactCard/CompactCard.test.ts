import type { VueWrapper } from '@vue/test-utils'
import CompactCard, { type CompactCardProps } from '@/features/global/components/cards/CompactCard/CompactCard.vue'
import { FloatingIconCardStub } from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a side menu compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof CompactCard>>

  const stubs = { FloatingIconCard: FloatingIconCardStub }

  const props: CompactCardProps = {
    element: { id: '1', title: 'Element 1' },
    icon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
    color: 'var(--color)',
    iconColor: 'var(--icon-color)',
    backgroundColor: 'var(--background-color)',
    borderColor: 'var(--border-color)',
    iconBorderColor: 'var(--icon-border-color)'
  }

  const slots = {
    default: '<div data-testid="slot-content">Slot Content</div>'
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(CompactCard, { props, slots, global: { stubs } })
    })

    BddTest().then('it should render the floating icon card with correct props', () => {
      const card = wrapper.findComponent(FloatingIconCardStub)
      expect(card.exists()).toBe(true)
      expect(card.props()).toMatchObject({
        title: props.element.title,
        titleColor: props.color,
        iconOptions: {
          name: props.icon,
          color: props.iconColor,
          borderColor: props.iconBorderColor
        },
        color: props.backgroundColor,
        borderColor: props.borderColor
      })
    })

    BddTest().then('it should render the slot content', () => {
      const slotContent = wrapper.find('[data-testid="slot-content"]')
      expect(slotContent.exists()).toBe(true)
      expect(slotContent.text()).toBe('Slot Content')
    })
  })
})
