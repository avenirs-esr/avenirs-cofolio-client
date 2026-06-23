import { CardStub } from '@/common/components/cards/Card/Card.stub'
import IconTitleCardContainer, {
  type IconTitleCardContainerProps
} from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a form field card container', () => {
  let wrapper: VueWrapper<InstanceType<typeof IconTitleCardContainer>>

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub
  }

  const props: IconTitleCardContainerProps = {
    title: 'Mon titre',
    titleIcon: 'mdi:attach-file',
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(IconTitleCardContainer, { props, global: { stubs } })
    })

    BddTest().then('it should render the card', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.exists()).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe(props.title)
    })

    BddTest().then('it should render the icon', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.props('icon')).toBe(props.titleIcon)
    })

    BddTest().then('it should render the card with collapsible false by default', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.props('collapsible')).toBe(false)
    })

    BddTest().then('it should render the card with collapsed false by default', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.props('collapsed')).toBe(false)
    })

    BddTest().then('it should render the card with titleOnly false by default', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.props('titleOnly')).toBe(false)
    })

    BddTest().then('it should not append an asterisk when required is false', () => {
      wrapper = mount(IconTitleCardContainer, {
        props: { ...props, required: false },
        global: { stubs },
      })

      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.props('text')).toBe(props.title)
    })

    BddTest().then('it should append an asterisk when required is true', () => {
      wrapper = mount(IconTitleCardContainer, {
        props: { ...props, required: true },
        global: { stubs },
      })

      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.props('text')).toBe(`${props.title} *`)
    })

    BddTest().then('it should render the slot content', () => {
      wrapper = mount(IconTitleCardContainer, {
        props,
        global: { stubs },
        slots: { default: '<p data-testid="slot-content">Contenu</p>' },
      })
      const slot = wrapper.find('[data-testid="slot-content"]')
      expect(slot.exists()).toBe(true)
    })

    BddTest().then('it should render the title slot content', () => {
      wrapper = mount(IconTitleCardContainer, {
        props,
        global: { stubs },
        slots: { title: '<button data-testid="title-slot-content">Action</button>' },
      })
      const slot = wrapper.find('[data-testid="title-slot-content"]')
      expect(slot.exists()).toBe(true)
    })
  })
})
