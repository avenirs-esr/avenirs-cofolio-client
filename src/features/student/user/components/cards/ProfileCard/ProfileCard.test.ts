import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import profile_banner_placeholder from '@/assets/profile_banner_placeholder.png'
import profile_picture_placeholder from '@/assets/profile_picture_placeholder.png'
import ProfileCard from '@/features/student/user/components/cards/ProfileCard/ProfileCard.vue'
import { AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { type DOMWrapper, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a profile card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProfileCard>>

  const stubs = {
    AvCard: AvCardStub
  }

  const studentSummary: ProfileOverviewDTO = {
    firstname: 'Jeanne',
    lastname: 'Moulin',
    email: 'j.moulin@example.com',
    profilePicture: {
      url: profile_picture_placeholder,
    },
    coverPicture: {
      url: profile_banner_placeholder,
    },
    bio: 'Je suis étudiante en chimie et écologie. Passionnée par l\'innovation durable, je souhaite utiliser la science pour protéger l\'environnement et bâtir un avenir plus respectueux de la planète.'
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(ProfileCard, {
        props: { studentSummary },
        global: { stubs }
      })
    })

    BddTest().then('it should render the profile card', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('[data-testid="profile-card"]').exists()).toBe(true)
    })

    BddTest().then('it should display the full name capitalized', () => {
      expect(wrapper.text()).toContain('Jeanne Moulin')
    })

    BddTest().then('it should display the bio', () => {
      expect(wrapper.text()).toContain(studentSummary.bio)
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
        expect(bannerImage.attributes('src')).toBe(studentSummary.coverPicture.url)
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
        expect(profilePicture.attributes('src')).toBe(studentSummary.profilePicture.url)
      })

      BddTest().then('it should have correct alt text', () => {
        expect(profilePicture.attributes('alt')).toBe('Photo de profil')
      })
    })

    BddTest().and('the AvCard component is configured', () => {
      let avCard: VueWrapper<InstanceType<typeof AvCardStub>>

      beforeEach(() => {
        avCard = wrapper.findComponent({ name: 'AvCard' }) as VueWrapper<InstanceType<typeof AvCardStub>>
      })

      BddTest().then('it should have correct background color', () => {
        expect(avCard.props('backgroundColor')).toBe('var(--other-background-base)')
      })

      BddTest().then('it should have correct title background', () => {
        expect(avCard.props('titleBackground')).toBe('var(--other-background-base)')
      })
    })
  })

  BddTest().when('the component receives default slot content', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(ProfileCard, {
        props: { studentSummary },
        slots: {
          default: '<div class="custom-content">Custom Content</div>'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the slot', () => {
      const slotContent = wrapper.find('.custom-content')
      expect(slotContent.exists()).toBe(true)
      expect(slotContent.text()).toBe('Custom Content')
    })
  })

  BddTest().when('the component is mounted without slot', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(ProfileCard, {
        props: { studentSummary },
        global: { stubs }
      })
    })

    BddTest().then('it should not render slot section', () => {
      const avCard = wrapper.findComponent({ name: 'AvCard' }) as VueWrapper<InstanceType<typeof AvCardStub>>
      const defaultSlot = avCard.vm.$slots.default
      expect(defaultSlot).toBeUndefined()
    })
  })

  BddTest().when('the student has lowercase names', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(ProfileCard, {
        props: {
          studentSummary: {
            ...studentSummary,
            firstname: 'jean',
            lastname: 'dupont'
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should capitalize the names', () => {
      expect(wrapper.text()).toContain('Jean Dupont')
    })
  })
})
