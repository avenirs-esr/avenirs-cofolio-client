import { type DeclaredExperienceViewDTO, EExperienceType } from '@/api/avenir-esr'
import { PeriodBadgeStub } from '@/common/activities/badges/PeriodBadge/PeriodBadge.stub'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import DeclaredExperienceCard from '@/features/student/personalCareer/components/cards/DeclaredExperienceCard/DeclaredExperienceCard.vue'
import { MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared experience card', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceCard>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub,
    AvBadge: AvBadgeStub,
    RouterLink: RouterLinkStub,
    PeriodBadge: PeriodBadgeStub
  }

  const baseDeclaredExperience: DeclaredExperienceViewDTO = {
    id: '1',
    title: 'Développeur Web',
    organization: 'Tech Company',
    startDate: '2023-01',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with complete data', () => {
    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      wrapper = mount(DeclaredExperienceCard, {
        props: {
          declaredExperience: {
            ...baseDeclaredExperience,
            experienceType: EExperienceType.PROFESSIONAL,
            organization: 'AVENIR(S)'
          }
        },
        global: { stubs }
      })
      floatingCard = wrapper.findComponent({ name: 'FloatingIconCard' }) as VueWrapper<InstanceType<typeof FloatingIconCardStub>>
    })

    BddTest().then('it should render the floating icon card', () => {
      expect(floatingCard.exists()).toBe(true)
    })

    BddTest().then('it should pass the title to floating icon card', () => {
      expect(floatingCard.props('title')).toBe('Développeur Web')
    })

    BddTest().then('it should have surface background color', () => {
      expect(floatingCard.props('color')).toBe('var(--surface-background)')
    })

    BddTest().then('it should have correct border color', () => {
      expect(floatingCard.props('borderColor')).toBe('var(--other-border-skill-card)')
    })

    BddTest().then('it should have correct border color on hover', () => {
      expect(floatingCard.props('borderColorOnHover')).toBe('var(--dark-background-primary1)')
    })

    BddTest().then('it should have correct height', () => {
      expect(floatingCard.props('height')).toBe('12.8rem')
    })

    BddTest().then('it should have correct title typography classes', () => {
      expect(floatingCard.props('titleTypographyClasses')).toBe('n6')
    })

    BddTest().then('it should have 1 header row', () => {
      expect(floatingCard.props('headerRows')).toBe(1)
    })

    BddTest().then('it should pass hub outline icon in icon options', () => {
      expect(floatingCard.props('iconOptions').name).toBe(MDI_ICONS.HUB_OUTLINE)
    })

    BddTest().and('the experience type badge is rendered', () => {
      let experienceTypeBadge: VueWrapper<InstanceType<typeof AvBadgeStub>> | undefined

      beforeEach(() => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        experienceTypeBadge = badges.find(badge => badge.props('label') === 'Expérience professionnelle') as VueWrapper<InstanceType<typeof AvBadgeStub>>
      })

      BddTest().then('it should exist', () => {
        expect(experienceTypeBadge).toBeDefined()
      })

      BddTest().then('it should have honour line icon', () => {
        expect(experienceTypeBadge?.props('icon')).toBe(RI_ICONS.HONOUR_LINE)
      })

      BddTest().then('it should have dark primary3 background color for professional', () => {
        expect(experienceTypeBadge?.props('backgroundColor')).toBe('var(--dark-background-primary3)')
      })

      BddTest().then('it should have card2 text color', () => {
        expect(experienceTypeBadge?.props('color')).toBe('var(--card2)')
      })
    })

    BddTest().and('the organization badge is rendered', () => {
      let organizationBadge: VueWrapper<InstanceType<typeof AvBadgeStub>> | undefined

      beforeEach(() => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        organizationBadge = badges.find(badge => badge.props('label') === 'AVENIR(S)') as VueWrapper<InstanceType<typeof AvBadgeStub>>
      })

      BddTest().then('it should exist', () => {
        expect(organizationBadge).toBeDefined()
      })

      BddTest().then('it should have map marker outline icon', () => {
        expect(organizationBadge?.props('icon')).toBe(MDI_ICONS.MAP_MARKER_OUTLINE)
      })

      BddTest().then('it should have text2 color', () => {
        expect(organizationBadge?.props('color')).toBe('var(--text2)')
      })

      BddTest().then('it should have transparent background', () => {
        expect(organizationBadge?.props('backgroundColor')).toBe('transparent')
      })

      BddTest().then('it should have ellipsis enabled', () => {
        expect(organizationBadge?.props('ellipsis')).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted with PERSONAL experience type', () => {
    let experienceTypeBadge: VueWrapper<InstanceType<typeof AvBadgeStub>> | undefined

    beforeEach(() => {
      wrapper = mount(DeclaredExperienceCard, {
        props: {
          declaredExperience: {
            ...baseDeclaredExperience,
            experienceType: EExperienceType.PERSONAL
          }
        },
        global: { stubs }
      })
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      experienceTypeBadge = badges.find(badge => badge.props('label') === 'Expérience personnelle') as VueWrapper<InstanceType<typeof AvBadgeStub>>
    })

    BddTest().then('it should display personal experience label', () => {
      expect(experienceTypeBadge).toBeDefined()
    })

    BddTest().then('it should apply dark success background color', () => {
      expect(experienceTypeBadge?.props('backgroundColor')).toBe('var(--dark-background-success)')
    })
  })

  BddTest().when('the component is mounted with PROFESSIONAL experience type', () => {
    let experienceTypeBadge: VueWrapper<InstanceType<typeof AvBadgeStub>> | undefined

    beforeEach(() => {
      wrapper = mount(DeclaredExperienceCard, {
        props: {
          declaredExperience: {
            ...baseDeclaredExperience,
            experienceType: EExperienceType.PROFESSIONAL
          }
        },
        global: { stubs }
      })
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      experienceTypeBadge = badges.find(badge => badge.props('label') === 'Expérience professionnelle') as VueWrapper<InstanceType<typeof AvBadgeStub>>
    })

    BddTest().then('it should display professional experience label', () => {
      expect(experienceTypeBadge).toBeDefined()
    })

    BddTest().then('it should apply dark primary3 background color', () => {
      expect(experienceTypeBadge?.props('backgroundColor')).toBe('var(--dark-background-primary3)')
    })
  })

  BddTest().when('the component is mounted without experience type', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredExperienceCard, {
        props: {
          declaredExperience: {
            ...baseDeclaredExperience,
            experienceType: undefined
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not render experience type badge', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      const experienceTypeLabels = ['Expérience personnelle', 'Expérience professionnelle']
      const hasExperienceTypeBadge = badges.some(badge => experienceTypeLabels.includes(badge.props('label') as string))
      expect(hasExperienceTypeBadge).toBe(false)
    })
  })

  BddTest().when('the component is mounted with only required fields', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredExperienceCard, {
        props: {
          declaredExperience: baseDeclaredExperience
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the floating icon card', () => {
      const floatingCard = wrapper.findComponent({ name: 'FloatingIconCard' })
      expect(floatingCard.exists()).toBe(true)
    })

    BddTest().then('it should only render the period and the organization badges', () => {
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      expect(badges.length).toBe(1)
      expect(wrapper.findComponent({ name: 'PeriodBadge' }).exists()).toBe(true)
    })
  })
})
