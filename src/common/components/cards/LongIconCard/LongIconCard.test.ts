import { CardStub } from '@/common/components/cards/Card/Card.stub'
import LongIconCard from '@/common/components/cards/LongIconCard/LongIconCard.vue'
import { AvIconStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach } from 'vitest'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return { ...actual, useTextTruncation: () => ({ isTruncated: mockIsTruncated }) }
})

BddTest().given('a long icon card component', () => {
  let wrapper: VueWrapper<InstanceType<typeof LongIconCard>>

  const stubs = {
    Card: CardStub,
    RouterLink: RouterLinkStub,
    AvIcon: AvIconStub,
    AvTooltip: AvTooltipStub
  }

  const baseProps = {
    title: 'Titre',
    icon: { name: 'mdi-account-circle-outline', color: 'var(--dark-background-primary1)' },
  }

  BddTest().when('the component is mounted without a "to" prop', () => {
    beforeEach(() => {
      wrapper = mount(LongIconCard, {
        props: baseProps,
        global: { stubs },
      })
    })

    BddTest().then('the component should not render a router link', () => {
      expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false)
    })

    BddTest().then('it should render the icon', () => {
      expect(wrapper.findComponent(AvIconStub).exists()).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      expect(wrapper.find('[data-testid="long-icon-card-title"]').text()).toBe(baseProps.title)
    })
  })

  BddTest().when('the component is mounted with a "to" prop', () => {
    beforeEach(() => {
      wrapper = mount(LongIconCard, {
        props: {
          ...baseProps,
          to: '/test-route',
        },
        global: { stubs },
      })
    })

    BddTest().then('the component should render a router link', () => {
      expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a slot', () => {
    beforeEach(() => {
      wrapper = mount(LongIconCard, {
        props: baseProps,
        slots: {
          default: '<div data-testid="slot-content">Slot Content</div>',
        },
        global: { stubs },
      })
    })

    BddTest().then('it should render the slot content', () => {
      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="slot-content"]').text()).toBe('Slot Content')
    })
  })
})
