import { type DeclaredProgramViewDTO, EProgramStatus } from '@/api/avenir-esr'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import DeclaredProgramCard from '@/features/student/personalCareer/components/cards/DeclaredProgramCard/DeclaredProgramCard.vue'
import { ICONS_DATA_URL, MDI_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared program card', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramCard>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub,
    AvBadge: AvBadgeStub
  }

  const baseDeclaredProgram: Omit<DeclaredProgramViewDTO, 'status'> = {
    id: '1',
    title: 'Master en Informatique',
    organization: 'Université Paris-Saclay',
    result: 'Mention Très Bien'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with complete data', () => {
    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      wrapper = mount(DeclaredProgramCard, {
        props: {
          declaredProgram: {
            ...baseDeclaredProgram,
            status: EProgramStatus.IN_PROGRESS
          }
        },
        global: { stubs }
      })
      floatingCard = wrapper.findComponent({ name: 'FloatingIconCard' }) as VueWrapper<InstanceType<typeof FloatingIconCardStub>>
    })

    BddTest().then('it should render the floating icon card', () => {
      expect(floatingCard.exists()).toBe(true)
    })

    BddTest().then('it should have surface background color', () => {
      expect(floatingCard.props('color')).toBe('var(--surface-background)')
    })

    BddTest().then('it should have correct border colors', () => {
      expect(floatingCard.props('borderColor')).toBe('var(--other-border-skill-card)')
      expect(floatingCard.props('borderColorOnHover')).toBe('var(--dark-background-primary1)')
    })

    BddTest().then('it should have correct dimensions', () => {
      expect(floatingCard.props('height')).toBe('12.8rem')
      expect(floatingCard.props('headerRows')).toBe(1)
    })

    BddTest().then('it should have typography classes', () => {
      expect(floatingCard.props('titleTypographyClasses')).toBe('n6')
    })

    BddTest().then('it should pass the title to floating icon card', () => {
      expect(floatingCard.props('title')).toBe(baseDeclaredProgram.title)
    })

    BddTest().then('it should have book open variant icon', () => {
      const iconOptions = floatingCard.props('iconOptions')
      expect(iconOptions.name).toBe(MDI_ICONS.BOOK_OPEN_VARIANT)
    })

    BddTest().then('it should have correct icon colors', () => {
      const iconOptions = floatingCard.props('iconOptions')
      expect(iconOptions.color).toBe('var(--text1)')
      expect(iconOptions.borderColor).toBe('var(--other-border-skill-card)')
    })

    BddTest().then('it should have correct icon position', () => {
      const iconOptions = floatingCard.props('iconOptions')
      expect(iconOptions.bottom).toBe('calc(-1 * 3.3rem)')
    })

    BddTest().then('it should have responsive flex utilities on badges container', () => {
      const badgesContainer = wrapper.find('.av-justify-end--md')
      expect(badgesContainer.exists()).toBe(true)
      expect(badgesContainer.classes()).toContain('av-col')
      expect(badgesContainer.classes()).toContain('av-row--md')
      expect(badgesContainer.classes()).toContain('av-align-end')
      expect(badgesContainer.classes()).toContain('av-justify-end--md')
      expect(badgesContainer.classes()).toContain('av-gap-sm')
    })

    BddTest().and('the status badge is rendered', () => {
      BddTest().then('it should exist', () => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        const statusBadge = badges.find(badge => badge.props('label') === 'En cours')
        expect(statusBadge).toBeDefined()
      })
    })

    BddTest().and('the organization badge is rendered', () => {
      let organizationBadge: VueWrapper<InstanceType<typeof AvBadgeStub>> | undefined

      beforeEach(() => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        organizationBadge = badges.find(badge => badge.props('label') === baseDeclaredProgram.organization) as VueWrapper<InstanceType<typeof AvBadgeStub>>
      })

      BddTest().then('it should exist', () => {
        expect(organizationBadge).toBeDefined()
      })

      BddTest().then('it should have building icon', () => {
        expect(organizationBadge?.props('icon')).toBe(MDI_ICONS.BUILDING)
      })

      BddTest().then('it should have correct colors', () => {
        expect(organizationBadge?.props('color')).toBe('var(--text1)')
        expect(organizationBadge?.props('backgroundColor')).toBe('transparent')
      })

      BddTest().then('it should have ellipsis enabled', () => {
        expect(organizationBadge?.props('ellipsis')).toBe(true)
      })
    })

    BddTest().and('the result badge is rendered', () => {
      let resultBadge: VueWrapper<InstanceType<typeof AvBadgeStub>> | undefined

      beforeEach(() => {
        const badges = wrapper.findAllComponents({ name: 'AvBadge' })
        resultBadge = badges.find(badge => badge.props('label') === baseDeclaredProgram.result) as VueWrapper<InstanceType<typeof AvBadgeStub>>
      })

      BddTest().then('it should exist', () => {
        expect(resultBadge).toBeDefined()
      })

      BddTest().then('it should have layout icon', () => {
        expect(resultBadge?.props('icon')).toBe(RI_ICONS.LAYOUT_6_LINE)
      })

      BddTest().then('it should have correct colors', () => {
        expect(resultBadge?.props('color')).toBe('var(--card2)')
        expect(resultBadge?.props('backgroundColor')).toBe('var(--dark-background-primary1)')
      })

      BddTest().then('it should have ellipsis enabled', () => {
        expect(resultBadge?.props('ellipsis')).toBe(true)
      })

      BddTest().then('it should have responsive visibility classes', () => {
        expect(resultBadge?.classes()).toContain('av-hidden')
        expect(resultBadge?.classes()).toContain('av-unhidden--md')
      })
    })
  })

  BddTest().when('the component is mounted with NOT_STARTED status', () => {
    let statusBadge: VueWrapper<InstanceType<typeof AvBadgeStub>> | undefined

    beforeEach(() => {
      wrapper = mount(DeclaredProgramCard, {
        props: {
          declaredProgram: {
            ...baseDeclaredProgram,
            status: EProgramStatus.NOT_STARTED
          }
        },
        global: { stubs }
      })
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      statusBadge = badges.find(badge => badge.props('label') === 'Non démarrée') as VueWrapper<InstanceType<typeof AvBadgeStub>>
    })

    BddTest().then('it should display not started status label', () => {
      expect(statusBadge).toBeDefined()
    })

    BddTest().then('it should apply light neutral background color', () => {
      expect(statusBadge?.props('backgroundColor')).toBe('var(--light-background-neutral)')
    })

    BddTest().then('it should apply text1 color for not started status', () => {
      expect(statusBadge?.props('color')).toBe('var(--text1)')
    })

    BddTest().then('it should use hourglass icon', () => {
      expect(statusBadge?.props('icon')).toBe(ICONS_DATA_URL.MDI_HOURGLASS)
    })
  })

  BddTest().when('the component is mounted with IN_PROGRESS status', () => {
    let statusBadge: VueWrapper<InstanceType<typeof AvBadgeStub>> | undefined

    beforeEach(() => {
      wrapper = mount(DeclaredProgramCard, {
        props: {
          declaredProgram: {
            ...baseDeclaredProgram,
            status: EProgramStatus.IN_PROGRESS
          }
        },
        global: { stubs }
      })
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      statusBadge = badges.find(badge => badge.props('label') === 'En cours') as VueWrapper<InstanceType<typeof AvBadgeStub>>
    })

    BddTest().then('it should display in progress status label', () => {
      expect(statusBadge).toBeDefined()
    })

    BddTest().then('it should apply light primary2 background color', () => {
      expect(statusBadge?.props('backgroundColor')).toBe('var(--light-background-primary2)')
    })

    BddTest().then('it should apply light foreground primary1 color', () => {
      expect(statusBadge?.props('color')).toBe('var(--light-foreground-primary1)')
    })

    BddTest().then('it should use hourglass icon from ICONS_DATA_URL', () => {
      expect(statusBadge?.props('icon')).toBe(ICONS_DATA_URL.MDI_HOURGLASS)
    })
  })

  BddTest().when('the component is mounted with COMPLETED status', () => {
    let statusBadge: VueWrapper<InstanceType<typeof AvBadgeStub>> | undefined

    beforeEach(() => {
      wrapper = mount(DeclaredProgramCard, {
        props: {
          declaredProgram: {
            ...baseDeclaredProgram,
            status: EProgramStatus.COMPLETED
          }
        },
        global: { stubs }
      })
      const badges = wrapper.findAllComponents({ name: 'AvBadge' })
      statusBadge = badges.find(badge => badge.props('label') === 'Terminée') as VueWrapper<InstanceType<typeof AvBadgeStub>>
    })

    BddTest().then('it should display completed status label', () => {
      expect(statusBadge).toBeDefined()
    })

    BddTest().then('it should apply light neutral background color', () => {
      expect(statusBadge?.props('backgroundColor')).toBe('var(--light-background-neutral)')
    })

    BddTest().then('it should apply text1 color for completed status', () => {
      expect(statusBadge?.props('color')).toBe('var(--text1)')
    })

    BddTest().then('it should use check outline icon', () => {
      expect(statusBadge?.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE)
    })
  })
})
