import { mockedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import {
  type ActivityOverviewDTO,
  EActivityThematic,
  EDeclaredActivityStatus
} from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { ActivityNewBadgeStub } from '@/features/student/buildProject/components/badges/ActivityNewBadge/ActivityNewBadge.stub'
import {
  ActivityPeriodSummaryBadgeStub
} from '@/features/student/buildProject/components/badges/ActivityPeriodSummaryBadge/ActivityPeriodSummaryBadge.stub'
import { ActivityStatusBadgeStub } from '@/features/student/buildProject/components/badges/ActivityStatusBadge/ActivityStatusBadge.stub'
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
    ActivityStatusBadge: ActivityStatusBadgeStub,
    ActivityPeriodSummaryBadge: ActivityPeriodSummaryBadgeStub,
    RouterLink: RouterLinkStub
  }

  const baseActivity: ActivityOverviewDTO = {
    id: '1',
    title: 'Atelier CV',
    summary: 'Résumé de l\'activité',
    executionPeriodInfoSummary: 'À faire cette année',
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
      const newBadge = wrapper.findAllComponents(ActivityNewBadgeStub)
      expect(newBadge).toBeDefined()
    })

    BddTest().then('the in progress status badge is rendered', () => {
      const statusBadge = wrapper.findAllComponents(ActivityStatusBadgeStub)
      expect(statusBadge).toBeDefined()
    })

    BddTest().then('the in period summary badge is rendered', () => {
      const badges = wrapper.findAllComponents(ActivityPeriodSummaryBadgeStub)
      expect(badges).toBeDefined()
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
      const subscribedBadge = wrapper.findAllComponents(ActivityStatusBadgeStub)

      expect(subscribedBadge).toBeDefined()
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
      const completedBadge = wrapper.findAllComponents(ActivityStatusBadgeStub)

      expect(completedBadge).toBeDefined()
    })
  })

  BddTest().when('the component is mounted period summary badge is not rendered', () => {
    beforeEach(() => {
      wrapper = mount(ActivityCard, {
        props: {
          activity: {
            ...baseActivity,
            executionPeriodInfoSummary: undefined
          }
        },
        global: { stubs }
      })
    })

    BddTest().then('the in period summary badge is rendered', () => {
      const badge = wrapper.findComponent(ActivityPeriodSummaryBadgeStub)
      expect(badge.exists()).toBe(false)
    })
  })
})
