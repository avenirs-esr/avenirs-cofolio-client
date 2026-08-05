import { type DeclaredExperienceViewDTO, EExperienceType } from '@/api/avenir-esr'
import { ICONS, ROUTES } from '@/common/constants'
import { AssociationCardStub } from '@/features/student/global/components/cards/AssociationCard/AssociationCard.stub'
import { DeclaredExperienceTypeBadgeStub }
  from '@/features/student/personalCareer/components/badges/DeclaredExperienceTypeBadge/DeclaredExperienceTypeBadge.stub'
import AssociatedDeclaredExperienceCard, {
  type AssociatedDeclaredExperienceCardProps
} from '@/features/student/personalCareer/components/cards/AssociatedDeclaredExperienceCard/AssociatedDeclaredExperienceCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an associated declared experience card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedDeclaredExperienceCard>>

  const stubs = {
    AssociationCard: AssociationCardStub,
    DeclaredExperienceTypeBadge: DeclaredExperienceTypeBadgeStub
  }

  const mockedDeclaredExperience: DeclaredExperienceViewDTO = {
    id: 'declared-experience-1',
    title: 'Développeur Web',
    experienceType: EExperienceType.PROFESSIONAL,
    organization: 'AVENIR(S)',
    startDate: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    declaredExperienceAssociationCountDTO: {
      traceAssociationsCount: 0,
      declaredSkillAssociationsCount: 0
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    const props: AssociatedDeclaredExperienceCardProps = {
      declaredExperience: mockedDeclaredExperience
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredExperienceCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the AssociationCard with the correct props', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)

      expect(associationCard.exists()).toBe(true)
      expect(associationCard.props()).toMatchObject({
        title: mockedDeclaredExperience.title,
        icon: ICONS.EXPERIENCES,
        color: 'var(--icon)',
        hoverBorderColor: 'var(--dark-background-neutral)',
        iconBorderColor: 'var(--other-border-skill-card)',
        backgroundColor: 'var(--surface-background)',
        to: {
          name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
          params: { id: mockedDeclaredExperience.id }
        }
      })
    })

    BddTest().then('it should pass disabled as false to the AssociationCard by default', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.props('disabled')).toBe(false)
    })

    BddTest().then('it should render the experience type badge with the experience type', () => {
      const badge = wrapper.findComponent(DeclaredExperienceTypeBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('experienceType')).toBe(EExperienceType.PROFESSIONAL)
    })
  })

  BddTest().when('the component is mounted without an experience type', () => {
    const props: AssociatedDeclaredExperienceCardProps = {
      declaredExperience: { ...mockedDeclaredExperience, experienceType: undefined }
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredExperienceCard, { props, global: { stubs } })
    })

    BddTest().then('it should not render the experience type badge', () => {
      expect(wrapper.findComponent(DeclaredExperienceTypeBadgeStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with disabled=true', () => {
    const props: AssociatedDeclaredExperienceCardProps = {
      declaredExperience: mockedDeclaredExperience,
      disabled: true
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredExperienceCard, { props, global: { stubs } })
    })

    BddTest().then('it should pass disabled=true to the AssociationCard', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.props('disabled')).toBe(true)
    })
  })
})
