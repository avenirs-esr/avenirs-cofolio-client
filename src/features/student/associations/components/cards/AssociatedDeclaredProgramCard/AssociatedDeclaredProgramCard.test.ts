import { type DeclaredProgramViewDTO, EProgramStatus } from '@/api/avenir-esr'
import { ICONS, ROUTES } from '@/common/constants'
import AssociatedDeclaredProgramCard, {
  type AssociatedDeclaredProgramCardProps
} from '@/features/student/associations/components/cards/AssociatedDeclaredProgramCard/AssociatedDeclaredProgramCard.vue'
import { AssociationCardStub } from '@/features/student/associations/components/cards/AssociationCard/AssociationCard.stub'
import { DeclaredProgramOrganizationBadgeStub }
  from '@/features/student/personalCareer/components/badges/DeclaredProgramOrganizationBadge/DeclaredProgramOrganizationBadge.stub'
import { DeclaredProgramStatusBadgeStub }
  from '@/features/student/personalCareer/components/badges/DeclaredProgramStatusBadge/DeclaredProgramStatusBadge.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an associated declared program card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedDeclaredProgramCard>>

  const stubs = {
    AssociationCard: AssociationCardStub,
    DeclaredProgramStatusBadge: DeclaredProgramStatusBadgeStub,
    DeclaredProgramOrganizationBadge: DeclaredProgramOrganizationBadgeStub
  }

  const mockedDeclaredProgram: DeclaredProgramViewDTO = {
    id: 'declared-program-1',
    title: 'Master en Informatique',
    status: EProgramStatus.IN_PROGRESS,
    organization: 'Université Paris-Saclay',
    result: 'Mention Très Bien',
    startDate: '2023-09-01',
    endDate: '2025-06-01',
    valorized: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    const props: AssociatedDeclaredProgramCardProps = {
      declaredProgram: mockedDeclaredProgram
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredProgramCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the AssociationCard with the correct props', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)

      expect(associationCard.exists()).toBe(true)
      expect(associationCard.props()).toMatchObject({
        title: mockedDeclaredProgram.title,
        icon: ICONS.DECLARED_PROGRAMS,
        color: 'var(--icon)',
        hoverBorderColor: 'var(--dark-background-neutral)',
        iconBorderColor: 'var(--other-border-skill-card)',
        backgroundColor: 'var(--surface-background)',
        to: {
          name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
          params: { id: mockedDeclaredProgram.id }
        }
      })
    })

    BddTest().then('it should pass disabled as false to the AssociationCard by default', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.props('disabled')).toBe(false)
    })

    BddTest().then('it should render the status badge with the program status', () => {
      const badge = wrapper.findComponent(DeclaredProgramStatusBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props('status')).toBe(EProgramStatus.IN_PROGRESS)
    })

    BddTest().then('it should render the organization badge with the program organization', () => {
      const badge = wrapper.findComponent(DeclaredProgramOrganizationBadgeStub)

      expect(badge.exists()).toBe(true)
      expect(badge.props('organization')).toBe(mockedDeclaredProgram.organization)
    })
  })

  BddTest().when('the component is mounted without an organization', () => {
    const props: AssociatedDeclaredProgramCardProps = {
      declaredProgram: { ...mockedDeclaredProgram, organization: '' }
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredProgramCard, { props, global: { stubs } })
    })

    BddTest().then('it should not render the organization badge', () => {
      expect(wrapper.findComponent(DeclaredProgramOrganizationBadgeStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with disabled=true', () => {
    const props: AssociatedDeclaredProgramCardProps = {
      declaredProgram: mockedDeclaredProgram,
      disabled: true
    }

    beforeEach(() => {
      wrapper = mount(AssociatedDeclaredProgramCard, { props, global: { stubs } })
    })

    BddTest().then('it should pass disabled=true to the AssociationCard', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.props('disabled')).toBe(true)
    })
  })
})
