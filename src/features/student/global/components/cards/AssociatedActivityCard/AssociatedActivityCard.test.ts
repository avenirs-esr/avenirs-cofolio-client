import { type DeclaredActivityViewDTO, EActivityThematic, EDeclaredActivityStatus } from '@/api/avenir-esr'
import {
  ActivityThematicBadgeStub
} from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { DeclaredActivityStatusBadgeStub } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.stub'
import { ICONS, ROUTES } from '@/common/constants'
import AssociatedActivityCard, {
  type AssociatedActivityCardProps
} from '@/features/student/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.vue'
import { AssociationCardStub } from '@/features/student/global/components/cards/AssociationCard/AssociationCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect, vi } from 'vitest'

BddTest().given('an associated activity card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedActivityCard>>

  const stubs = {
    AssociationCard: AssociationCardStub,
    ActivityThematicBadge: ActivityThematicBadgeStub,
    DeclaredActivityStatusBadge: DeclaredActivityStatusBadgeStub
  }

  const mockedDeclaredActivity: DeclaredActivityViewDTO = {
    id: '1',
    activityId: 'id-1',
    title: 'Activity title',
    summary: 'Activity summary',
    thematic: EActivityThematic.RESUMES,
    status: EDeclaredActivityStatus.IN_PROGRESS
  } as DeclaredActivityViewDTO

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    const props: AssociatedActivityCardProps = {
      declaredActivity: mockedDeclaredActivity
    }

    beforeEach(() => {
      wrapper = mount(AssociatedActivityCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the AssociationCard with the correct props', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)

      expect(associationCard.exists()).toBe(true)
      expect(associationCard.props()).toMatchObject({
        title: mockedDeclaredActivity.title,
        icon: ICONS.ACTIVITY,
        color: 'var(--icon)',
        hoverBorderColor: 'var(--dark-background-neutral)',
        iconBorderColor: 'var(--other-border-skill-card)',
        backgroundColor: 'var(--surface-background)',
        to: {
          name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
          params: {
            id: mockedDeclaredActivity.id,
            thematic: mockedDeclaredActivity.thematic
          }
        }
      })
    })

    BddTest().then('it should pass disabled as false to the AssociationCard by default', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.props('disabled')).toBe(false)
    })

    BddTest().then('it should render the status badge with the correct status', () => {
      const statusBadge = wrapper.findComponent(DeclaredActivityStatusBadgeStub)

      expect(statusBadge.exists()).toBe(true)
      expect(statusBadge.props('status')).toBe(EDeclaredActivityStatus.IN_PROGRESS)
    })
  })

  BddTest().when('the component is mounted with disabled=true', () => {
    const props: AssociatedActivityCardProps = {
      declaredActivity: mockedDeclaredActivity,
      disabled: true
    }

    beforeEach(() => {
      wrapper = mount(AssociatedActivityCard, { props, global: { stubs } })
    })

    BddTest().then('it should pass disabled=true to the AssociationCard', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.props('disabled')).toBe(true)
    })
  })
})
