import { CardStub } from '@/common/components/cards/Card/Card.stub'
import NotificationCard from '@/common/notifications/components/NotificationCard/NotificationCard.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a notification card', () => {
  let wrapper: VueWrapper<InstanceType<typeof NotificationCard>>

  const stubs = {
    Card: CardStub,
    RouterLink: RouterLinkStub,
    AvIcon: AvIconStub
  }

  const props = {
    id: 'notification-1',
    seen: true,
    createdAt: '2024-06-01T10:00:00Z'
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(NotificationCard, {
        props,
        slots: {
          default: '<div data-testid="custom-content"></div>'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the notification card as a div', () => {
      const card = wrapper.find('[data-testid="notification-card"]')
      expect(card.exists()).toBe(true)
      expect(card.element.tagName).toBe('DIV')
      expect(card.classes()).not.toContain('notification-card--unseen')
    })

    BddTest().then('it should rendered the bullet and the icon', () => {
      expect(wrapper.find('[data-testid="notification-card-bullet"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="notification-card-icon"]').exists()).toBe(true)
    })

    BddTest().then('it should render the slot content', () => {
      expect(wrapper.find('[data-testid="custom-content"]').exists()).toBe(true)
    })

    BddTest().then('it should rendered the formatted creation date', () => {
      expect(wrapper.find('[data-testid="notification-card-created-at"]').exists()).toBe(true)
    })

    BddTest().then('it should rendered the redirect icon', () => {
      expect(wrapper.find('[data-testid="notification-card-redirect-icon"]').exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with seen=false', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(NotificationCard, {
        props: {
          ...props,
          seen: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the notification card as unseen', () => {
      expect(wrapper.find('[data-testid="notification-card"]').classes()).toContain('notification-card--unseen')
    })
  })

  BddTest().when('the component is mounted with to', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(NotificationCard, {
        props: {
          ...props,
          to: '/notifications/1'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the notification card as a link', () => {
      expect(wrapper.find('[data-testid="notification-card"]').element.tagName).toBe('A')
    })
  })

  BddTest().when('the card is clicked without to', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(NotificationCard, {
        props,
        global: { stubs }
      })
      await wrapper.find('[data-testid="notification-card"]').trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not emit redirect', () => {
      expect(wrapper.emitted('redirect')).toBeUndefined()
    })

    BddTest().then('it should not emit seen', () => {
      expect(wrapper.emitted('seen')).toBeUndefined()
    })
  })

  BddTest().when('the card is clicked seen=true and to', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(NotificationCard, {
        props: { ...props, seen: true, to: '/notifications/1' },
        global: { stubs }
      })
      await wrapper.find('[data-testid="notification-card"]').trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit redirect', () => {
      expect(wrapper.emitted('redirect')).toBeTruthy()
    })

    BddTest().then('it should not emit seen', () => {
      expect(wrapper.emitted('seen')).toBeUndefined()
    })
  })

  BddTest().when('the card is clicked with seen=false and to', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(NotificationCard, {
        props: { ...props, seen: false, to: '/notifications/1' },
        global: { stubs }
      })
      await wrapper.find('[data-testid="notification-card"]').trigger('click')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit redirect', () => {
      expect(wrapper.emitted('redirect')).toBeTruthy()
    })

    BddTest().then('it should emit seen with the notification id', () => {
      expect(wrapper.emitted('seen')).toBeTruthy()
      expect(wrapper.emitted('seen')?.[0]).toEqual([props.id])
    })
  })
})
