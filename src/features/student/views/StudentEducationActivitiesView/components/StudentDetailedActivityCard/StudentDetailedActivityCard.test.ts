import { ActivityStatus } from '@/types'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'
import StudentDetailedActivityCard from './StudentDetailedActivityCard.vue'

vi.doMock('@/ui/tokens', () => ({
  MDI_ICONS: {
    ATTACH_FILE: 'mdi-attach-file',
    TEST_TUBE_EMPTY: 'mdi-test-tube-empty',
  },
}))

describe('studentDetailedActivityCard.vue', () => {
  let mathRandomSpy: MockInstance

  const stubs = {
    DsfrBadge: {
      name: 'DsfrBadge',
      template: `<div class="dsfr-badge" />`,
      props: ['label', 'type', 'small', 'ellipsis']
    },
    VIcon: {
      name: 'VIcon',
      props: ['name'],
      template: '<i class="mock-v-icon" />',
    },
    AvBadge: {
      name: 'AvBadge',
      template: `<div class="av-badge"/>`,
      props: {
        label: String,
        small: {
          type: Boolean,
          default: false
        },
        ellipsis: {
          type: Boolean,
          default: false
        },
        color: String,
        backgroundColor: String,
        iconPath: String
      }
    },
    RouterLink: RouterLinkStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mathRandomSpy = vi.spyOn(Math, 'random')
  })

  afterEach(() => {
    mathRandomSpy.mockRestore()
  })

  const activity = {
    id: 'ams1',
    name: 'Stage 2.1 SMB CHIMIOTEK, réalisation d’un audit environnemental et proposition d’un plan d’amélioration des performances d’un procédé...',
    startedActivityCount: 2,
    totalActivityCount: 4,
    skillCount: 2,
    trackCount: 3,
    status: ActivityStatus.IN_PROGRESS
  }

  const activityCompleted = {
    ...activity,
    status: ActivityStatus.COMPLETED
  }
  const activityInProgress = {
    ...activity,
    status: ActivityStatus.IN_PROGRESS
  }
  const activitySubmitted = {
    ...activity,
    status: ActivityStatus.SUBMITTED
  }
  const activityNotStarted = {
    ...activity,
    status: ActivityStatus.NOT_STARTED
  }
  const activityWithoutActivity = {
    ...activity,
    totalActivityCount: 0,
  }
  const activityWithActivities = {
    ...activity,
    totalActivityCount: 4,
  }

  it('should render properly with given props', async () => {
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity },
      global: {
        stubs
      }
    })

    expect(wrapper.text()).toContain(activity.name)
    expect(wrapper.text()).toContain(`${activity.trackCount} traces`)
    expect(wrapper.text()).toContain(`${activity.skillCount} compétence`)
  })

  it('should render completed status badge with completed activity', async () => {
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity: activityCompleted },
      global: {
        stubs
      }
    })

    const statusBadge = wrapper.findComponent('.student-detailed-activity-card__status-badge') as VueWrapper<any, any>
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.props('label')).toContain('Terminée')
  })

  it('should render in progress status badge with in progress activity', async () => {
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity: activityInProgress },
      global: {
        stubs
      }
    })

    const statusBadge = wrapper.findComponent('.student-detailed-activity-card__status-badge') as VueWrapper<any, any>
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.props('label')).toContain('En cours')
  })

  it('should render submitted status badge with submitted activity', async () => {
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity: activitySubmitted },
      global: {
        stubs
      }
    })

    const statusBadge = wrapper.findComponent('.student-detailed-activity-card__status-badge') as VueWrapper<any, any>
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.props('label')).toContain('Soumise')
  })

  it('should render not started status badge with not started activity', async () => {
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity: activityNotStarted },
      global: {
        stubs
      }
    })

    const statusBadge = wrapper.findComponent('.student-detailed-activity-card__status-badge') as VueWrapper<any, any>
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.props('label')).toContain('Non initiée')
  })

  it('should not render acitivty count badge when totalActivityCount equals 0', async () => {
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity: activityWithoutActivity },
      global: {
        stubs
      }
    })

    expect(wrapper.findComponent('.student-detailed-activity-card__activity-badge').exists()).toBe(false)
  })

  it('should render acitivty count badge when totalActivityCount is greater than 0', async () => {
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity: activityWithActivities },
      global: {
        stubs
      }
    })

    expect(wrapper.findComponent('.student-detailed-activity-card__activity-badge').exists()).toBe(true)
  })

  it('should not render deliverable badge when deliverable count equals 0', async () => {
    mathRandomSpy.mockReturnValue(0.1)
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity: activityWithActivities },
      global: {
        stubs
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent('.student-detailed-activity-card__deliverable-badge').exists()).toBe(false)
  })

  it('should render deliverable badge when deliverable count is greater than 0', async () => {
    mathRandomSpy.mockReturnValue(1)
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity: activityWithActivities },
      global: {
        stubs
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent('.student-detailed-activity-card__deliverable-badge').exists()).toBe(true)
  })

  it('should render to submit deliverable badge when deliverable status is to submit', async () => {
    mathRandomSpy.mockReturnValue(1)
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity: activityWithActivities },
      global: {
        stubs
      }
    })

    await wrapper.vm.$nextTick()

    const deliverableBadge = wrapper.findComponent('.student-detailed-activity-card__deliverable-badge') as VueWrapper<any, any>
    expect(deliverableBadge.exists()).toBe(true)
    expect(deliverableBadge.props('label')).toContain('rendus à soumettre')
  })

  it('should render submitted deliverable badge when deliverable status is submitted', async () => {
    mathRandomSpy.mockReturnValue(0.4)
    const wrapper = await mountWithRouter(StudentDetailedActivityCard, {
      props: { activity: activityWithActivities },
      global: {
        stubs
      }
    })

    await wrapper.vm.$nextTick()

    const deliverableBadge = wrapper.findComponent('.student-detailed-activity-card__deliverable-badge') as VueWrapper<any, any>
    expect(deliverableBadge.exists()).toBe(true)
    expect(deliverableBadge.props('label')).toContain('rendu validé')
  })
})
