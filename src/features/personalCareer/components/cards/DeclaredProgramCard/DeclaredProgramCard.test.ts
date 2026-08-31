import { type DeclaredProgramViewDTO, EProgramStatus } from '@/api/avenir-esr'
import { FloatingIconCardStub } from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { DeclaredProgramOrganizationBadgeStub }
  from '@/features/personalCareer/components/badges/DeclaredProgramOrganizationBadge/DeclaredProgramOrganizationBadge.stub'
import { DeclaredProgramResultBadgeStub }
  from '@/features/personalCareer/components/badges/DeclaredProgramResultBadge/DeclaredProgramResultBadge.stub'
import { DeclaredProgramStatusBadgeStub }
  from '@/features/personalCareer/components/badges/DeclaredProgramStatusBadge/DeclaredProgramStatusBadge.stub'
import DeclaredProgramCard from '@/features/personalCareer/components/cards/DeclaredProgramCard/DeclaredProgramCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared program card', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramCard>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub,
    RouterLink: RouterLinkStub,
    DeclaredProgramStatusBadge: DeclaredProgramStatusBadgeStub,
    DeclaredProgramResultBadge: DeclaredProgramResultBadgeStub,
    DeclaredProgramOrganizationBadge: DeclaredProgramOrganizationBadgeStub
  }

  const baseDeclaredProgram: DeclaredProgramViewDTO = {
    id: '1',
    title: 'Master en Informatique',
    organization: 'Université Paris-Saclay',
    result: 'Mention Très Bien',
    status: EProgramStatus.IN_PROGRESS,
    valorized: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with complete data', () => {
    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      wrapper = mount(DeclaredProgramCard, {
        props: { declaredProgram: baseDeclaredProgram },
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
      expect(iconOptions.name).toBe(MDI_ICONS.SCHOOL_OUTLINE)
    })

    BddTest().then('it should have correct icon colors', () => {
      const iconOptions = floatingCard.props('iconOptions')
      expect(iconOptions.color).toBe('var(--icon)')
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
      BddTest().then('it should receive the status', () => {
        expect(wrapper.findComponent(DeclaredProgramStatusBadgeStub).props('status')).toBe(baseDeclaredProgram.status)
      })
    })

    BddTest().and('the organization badge is rendered', () => {
      BddTest().then('it should receive the organization', () => {
        expect(wrapper.findComponent(DeclaredProgramOrganizationBadgeStub).props('organization')).toBe(baseDeclaredProgram.organization)
      })
    })

    BddTest().and('the result badge is rendered', () => {
      let resultBadge: VueWrapper<InstanceType<typeof DeclaredProgramResultBadgeStub>>

      beforeEach(() => {
        resultBadge = wrapper.findComponent(DeclaredProgramResultBadgeStub) as VueWrapper<InstanceType<typeof DeclaredProgramResultBadgeStub>>
      })

      BddTest().then('it should receive the result', () => {
        expect(resultBadge.props('result')).toBe(baseDeclaredProgram.result)
      })

      BddTest().then('it should have responsive visibility classes', () => {
        expect(resultBadge.classes()).toContain('av-hidden')
        expect(resultBadge.classes()).toContain('av-unhidden--md')
      })
    })
  })

  BddTest().when('the declared program has no status, result or organization', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredProgramCard, {
        props: {
          declaredProgram: {
            ...baseDeclaredProgram,
            result: undefined
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not render the result badge', () => {
      expect(wrapper.findComponent(DeclaredProgramResultBadgeStub).exists()).toBe(false)
    })
  })
})
