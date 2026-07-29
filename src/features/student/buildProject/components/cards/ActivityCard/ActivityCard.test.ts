import { mockedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import {
  type ActivityOverviewDTO,
  EActivityThematic,
  EDeclaredActivityStatus
} from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { DeclaredActivityStatusBadgeStub } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.stub'
import { ActivityNewBadgeStub } from '@/features/student/buildProject/components/badges/ActivityNewBadge/ActivityNewBadge.stub'
import { ActivityPeriodBadgeStub } from '@/features/student/buildProject/components/badges/ActivityPeriodBadge/ActivityPeriodBadge.stub'
import ActivityCard from '@/features/student/buildProject/components/cards/ActivityCard/ActivityCard.vue'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an activity card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityCard>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub,
    AvBadge: AvBadgeStub,
    ActivityThematicBadge: ActivityThematicBadgeStub,
    ActivityNewBadge: ActivityNewBadgeStub,
    DeclaredActivityStatusBadge: DeclaredActivityStatusBadgeStub,
    ActivityPeriodBadge: ActivityPeriodBadgeStub,
    RouterLink: RouterLinkStub
  }

  const baseActivity: ActivityOverviewDTO = {
    id: '1',
    author: { userId: 'user-1', firstName: 'Jean', lastName: 'Dupont' },
    title: 'Atelier CV',
    summary: 'Résumé de l\'activité',
    startDate: '2025-09-01',
    endDate: '2026-06-30',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    isNew: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with IN_PROGRESS status and new flag', () => {
    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      wrapper = mount(ActivityCard, {
        props: {
          activity: {
            ...baseActivity,
            status: EDeclaredActivityStatus.IN_PROGRESS,
            isNew: true
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
      expect(floatingCard.props('title')).toBe('Atelier CV')
    })

    BddTest().then('it should have surface background color', () => {
      expect(floatingCard.props('color')).toBe('var(--surface-background)')
    })

    BddTest().then('it should pass target arrow icon in icon options', () => {
      expect(floatingCard.props('iconOptions').name).toBe(MDI_ICONS.TARGET_ARROW)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      const badge = wrapper.findComponent(ActivityThematicBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe(mockedActivityDetail.thematic)
    })

    BddTest().then('the new badge is rendered', () => {
      const newBadge = wrapper.findComponent(ActivityNewBadgeStub)
      expect(newBadge.exists()).toBe(true)
    })

    BddTest().then('the in progress status badge is rendered', () => {
      const statusBadge = wrapper.findComponent(DeclaredActivityStatusBadgeStub)
      expect(statusBadge.props('status')).toBe(EDeclaredActivityStatus.IN_PROGRESS)
    })

    BddTest().then('the period badge is rendered', () => {
      const badges = wrapper.findComponent(ActivityPeriodBadgeStub)
      expect(badges.exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with SUBMITTED status', () => {
    beforeEach(() => {
      wrapper = mount(ActivityCard, {
        props: {
          activity: {
            ...baseActivity,
            status: EDeclaredActivityStatus.SUBMITTED
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render submitted badge', () => {
      const submittedBadge = wrapper.findComponent(DeclaredActivityStatusBadgeStub)
      expect(submittedBadge.props('status')).toBe(EDeclaredActivityStatus.SUBMITTED)
    })
  })

  BddTest().when('the component is mounted with SUBSCRIBED status', () => {
    beforeEach(() => {
      wrapper = mount(ActivityCard, {
        props: {
          activity: {
            ...baseActivity,
            status: EDeclaredActivityStatus.SUBSCRIBED
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render subscribed badge', () => {
      const subscribedBadge = wrapper.findComponent(DeclaredActivityStatusBadgeStub)
      expect(subscribedBadge.props('status')).toBe(EDeclaredActivityStatus.SUBSCRIBED)
    })
  })

  BddTest().when('the component is mounted with COMPLETED status', () => {
    beforeEach(() => {
      wrapper = mount(ActivityCard, {
        props: {
          activity: {
            ...baseActivity,
            status: EDeclaredActivityStatus.COMPLETED
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render completed badge', () => {
      const completedBadge = wrapper.findComponent(DeclaredActivityStatusBadgeStub)
      expect(completedBadge.props('status')).toBe(EDeclaredActivityStatus.COMPLETED)
    })
  })

  BddTest().when('the component is mounted without a period', () => {
    beforeEach(() => {
      wrapper = mount(ActivityCard, {
        props: {
          activity: {
            ...baseActivity,
            startDate: undefined,
            endDate: undefined
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('the period badge is not rendered', () => {
      const badge = wrapper.findComponent(ActivityPeriodBadgeStub)
      expect(badge.exists()).toBe(false)
    })
  })
})
