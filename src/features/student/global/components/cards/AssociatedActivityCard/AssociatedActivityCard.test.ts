import { type DeclaredActivityViewDTO, EActivityThematic } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import {
  ActivityThematicBadgeStub
} from '@/features/student/buildProject/components/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import AssociatedActivityCard, {
  type AssociatedActivityCardProps
} from '@/features/student/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.vue'
import { AssociationCardStub } from '@/features/student/global/components/cards/AssociationCard/AssociationCard.stub'
import { ICONS } from '@/features/student/global/icons'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect, vi } from 'vitest'

BddTest().given('an associated activity card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedActivityCard>>

  const stubs = {
    AssociationCard: AssociationCardStub,
    ActivityThematicBadge: ActivityThematicBadgeStub
  }

  const mockedDeclaredActivity: DeclaredActivityViewDTO = {
    id: '1',
    activityId: 'id-1',
    title: 'Activity title',
    summary: 'Activity summary',
    thematic: EActivityThematic.RESUMES
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
  })
})
