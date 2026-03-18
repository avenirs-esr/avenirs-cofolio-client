import AssociationCard, { type AssociationCardProps } from '@/features/student/global/components/cards/AssociationCard/AssociationCard.vue'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { ICONS } from '@/features/student/global/icons'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { expect, vi } from 'vitest'

BddTest().given('an association card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociationCard>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub,
    RouterLink: RouterLinkStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with base props', () => {
    const props: AssociationCardProps = {
      title: 'Skill',
      icon: ICONS.SKILLS,
      color: 'var(--color)',
      backgroundColor: 'var(--background-color)',
      to: '/test'
    }

    beforeEach(async () => {
      wrapper = await mountWithRouter<typeof AssociationCard>(AssociationCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the FloatingIconCard with the correct props', () => {
      const floatingIconCard = wrapper.findComponent(FloatingIconCardStub)
      expect(floatingIconCard.exists()).toBe(true)
      expect(floatingIconCard.props()).toMatchObject({
        title: props.title,
        titleColor: props.color,
        iconOptions: { name: props.icon, color: props.color, borderColor: props.color },
        color: props.backgroundColor,
        borderColorOnHover: props.backgroundColor,
      })
    })
  })

  BddTest().when('the component is mounted with all props and all slots', () => {
    const props: AssociationCardProps = {
      title: 'Skill',
      icon: ICONS.SKILLS,
      color: 'var(--color)',
      backgroundColor: 'var(--background-color)',
      hoverBorderColor: 'var(--hover-border-color)',
      iconBorderColor: 'var(--icon-border-color)',
      to: '/test'
    }

    const slots = {
      body: '<div data-testid="body">Body content</div>',
      footer: '<div data-testid="footer">Footer content</div>'
    }

    beforeEach(async () => {
      wrapper = await mountWithRouter<typeof AssociationCard>(AssociationCard, { props, slots, global: { stubs } })
    })

    BddTest().then('it should render the FloatingIconCard with the correct props', () => {
      const floatingIconCard = wrapper.findComponent(FloatingIconCardStub)
      expect(floatingIconCard.exists()).toBe(true)
      expect(floatingIconCard.props()).toMatchObject({
        title: props.title,
        titleColor: props.color,
        iconOptions: { name: props.icon, color: props.color, borderColor: props.iconBorderColor },
        color: props.backgroundColor,
        borderColorOnHover: props.hoverBorderColor,
      })
    })

    BddTest().then('it should render the body and footer slots', () => {
      const body = wrapper.find('[data-testid="body"]')
      const footer = wrapper.find('[data-testid="footer"]')
      expect(body.exists()).toBe(true)
      expect(body.text()).toBe('Body content')
      expect(footer.exists()).toBe(true)
      expect(footer.text()).toBe('Footer content')
    })
  })
})
