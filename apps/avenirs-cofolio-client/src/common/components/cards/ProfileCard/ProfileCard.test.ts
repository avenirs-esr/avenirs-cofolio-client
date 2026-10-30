import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import ProfileCard from '@/common/components/cards/ProfileCard/ProfileCard.vue'

const mockObjectUrl = 'blob:http://localhost/picture'
const OriginalURL = URL

class MockURL extends OriginalURL {
  static createObjectURL = vi.fn(() => mockObjectUrl)
  static revokeObjectURL = vi.fn()
}

BddTest().given('a profile card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProfileCard>>

  const stubs = {
    Card: CardStub
  }

  const props = {
    firstName: 'Jeanne',
    lastName: 'Moulin',
    profilePicture: { ...mockedProfileOverview.profilePicture, id: 'TEST_ID' },
    coverPicture: { ...mockedProfileOverview.coverPicture, id: 'TEST_ID' },
    bio: 'Je suis étudiante en chimie et écologie. Passionnée par l\'innovation durable, je souhaite utiliser la science pour protéger l\'environnement et bâtir un avenir plus respectueux de la planète.'
  }

  beforeEach(() => {
    vi.stubGlobal('URL', MockURL)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(ProfileCard, {
        props,
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should render the profile card', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('[data-testid="profile-card"]').exists()).toBe(true)
    })

    BddTest().then('it should display the full name capitalized', () => {
      expect(wrapper.text()).toContain('Jeanne Moulin')
    })

    BddTest().then('it should display the bio', () => {
      expect(wrapper.text()).toContain(props.bio)
    })

    BddTest().and('the banner image is rendered', () => {
      let bannerImage: DOMWrapper<Element>

      beforeEach(() => {
        bannerImage = wrapper.find('[data-testid="profile-banner"]')
      })

      BddTest().then('it should exist', () => {
        expect(bannerImage.exists()).toBe(true)
      })

      BddTest().then('it should have correct src', () => {
        expect(bannerImage.attributes('src')).toBe(mockObjectUrl)
      })

      BddTest().then('it should have correct alt text', () => {
        expect(bannerImage.attributes('alt')).toBe('Bannière du profil')
      })
    })

    BddTest().and('the profile picture is rendered', () => {
      let profilePicture: DOMWrapper<Element>

      beforeEach(() => {
        profilePicture = wrapper.find('[data-testid="profile-picture"]')
      })

      BddTest().then('it should exist', () => {
        expect(profilePicture.exists()).toBe(true)
      })

      BddTest().then('it should have correct src', () => {
        expect(profilePicture.attributes('src')).toBe(mockObjectUrl)
      })

      BddTest().then('it should have correct alt text', () => {
        expect(profilePicture.attributes('alt')).toBe('Photo de profil')
      })
    })

    BddTest().and('the Card component is configured', () => {
      let card: VueWrapper<InstanceType<typeof CardStub>>

      beforeEach(() => {
        card = wrapper.findComponent(CardStub)
      })

      BddTest().then('it should have correct background color', () => {
        expect(card.props('backgroundColor')).toBe('var(--other-background-base)')
      })

      BddTest().then('it should have correct title background', () => {
        expect(card.props('titleBackground')).toBe('var(--other-background-base)')
      })
    })
  })

  BddTest().when('the component receives default slot content', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(ProfileCard, {
        props,
        slots: {
          default: '<div class="custom-content">Custom Content</div>'
        },
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should render the slot', () => {
      const slotContent = wrapper.find('.custom-content')
      expect(slotContent.exists()).toBe(true)
      expect(slotContent.text()).toBe('Custom Content')
    })
  })

  BddTest().when('the component is mounted without slot', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(ProfileCard, {
        props,
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should not render slot section', () => {
      const card = wrapper.findComponent(CardStub)
      const defaultSlot = card.vm.$slots.default
      expect(defaultSlot).toBeUndefined()
    })
  })

  BddTest().when('the component receives lowercase names', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(ProfileCard, {
        props: {
          ...props,
          firstName: 'jean',
          lastName: 'dupont'
        },
        global: { stubs }
      })
      await flushPromises()
    })

    BddTest().then('it should capitalize the names', () => {
      expect(wrapper.text()).toContain('Jean Dupont')
    })
  })
})
