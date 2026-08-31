import { CardStub } from '@/common/components/cards/Card/Card.stub'
import AssociationsCard from '@/features/global/components/cards/AssociationsCard/AssociationsCard.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an association cards', () => {
  let wrapper: VueWrapper

  const stubs = {
    Card: CardStub,
    AvIconText: AvIconTextStub,
  }

  const props = {
    title: 'Mon titre test (3)',
    icon: 'test-icon',
  }

  BddTest().when('the component is mounted', () => {
    let avIconText: VueWrapper<InstanceType<typeof AvIconTextStub>>

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociationsCard, { props, global: { stubs } })
      avIconText = wrapper.findComponent(AvIconTextStub)
    })

    BddTest().then('it should render the card component', () => {
      expect(wrapper.findComponent(CardStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the title to av icon text', () => {
      expect(avIconText.props('text')).toBe(props.title)
    })

    BddTest().then('it should pass the icon to av icon text', () => {
      expect(avIconText.props('icon')).toBe(props.icon)
    })
  })

  BddTest().when('the component is mounted with slot content', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(AssociationsCard, {
        props,
        global: { stubs },
        slots: { default: '<div data-testid="slot-content">Content</div>' },
      })
    })

    BddTest().then('it should render the slot content', () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true)
    })
  })
})
