import { AmsStatus, type AmsViewDTO } from '@/api/avenir-esr'
import StudentDetailedAmsCard from '@/features/student/views/StudentEducationAmsView/components/StudentDetailedAmsCard/StudentDetailedAmsCard.vue'
import { mountWithRouter } from '@/ui/tests/utils'
import { RouterLinkStub } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.doMock('@/ui/tokens', () => ({
  MDI_ICONS: {
    ATTACH_FILE: 'mdi-attach-file',
    TEST_TUBE_EMPTY: 'mdi-test-tube-empty',
  },
}))

describe('studentDetailedAmsCard.vue', () => {
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
    StudentCountSkillsIconText: {
      name: 'StudentCountSkillsIconText',
      template: `<div class="student-count-skills-icon-text" />`,
      props: ['countSkills']
    },
    StudentCountTracesIconText: {
      name: 'StudentCountTracesIconText',
      template: `<div class="student-count-traces-icon-text" />`,
      props: ['countTraces']
    },
    StudentAmsStatusBadge: {
      name: 'StudentAmsStatusBadge',
      template: `<div class="student-ams-status-badge" />`,
      props: ['status']
    },
    RouterLink: RouterLinkStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const ams: AmsViewDTO = {
    id: 'ams1',
    title: 'Stage 2.1 SMB CHIMIOTEK, réalisation d’un audit environnemental et proposition d’un plan d’amélioration des performances d’un procédé...',
    countSkills: 2,
    countTraces: 3,
    status: AmsStatus.IN_PROGRESS,
    progress: {
      startedActivities: 2,
      totalActivities: 4
    }
  }

  const amsCompleted: AmsViewDTO = {
    ...ams,
    status: AmsStatus.COMPLETED
  }
  const amsInProgress: AmsViewDTO = {
    ...ams,
    status: AmsStatus.IN_PROGRESS
  }
  const amsSubmitted: AmsViewDTO = {
    ...ams,
    status: AmsStatus.SUBMITTED
  }
  const amsNotStarted: AmsViewDTO = {
    ...ams,
    status: AmsStatus.NOT_STARTED
  }
  const amsWithoutActivity: AmsViewDTO = {
    ...ams,
    progress: {
      ...ams.progress,
      totalActivities: 0
    }
  }
  const amsWithActivities: AmsViewDTO = {
    ...ams,
    progress: {
      ...ams.progress,
      totalActivities: 4
    }
  }

  it('should render properly with given props', async () => {
    const wrapper = await mountWithRouter(StudentDetailedAmsCard, {
      props: { ams },
      global: {
        stubs
      }
    })

    expect(wrapper.text()).toContain(ams.title)
    const tracesIconText = wrapper.findComponent({ name: 'StudentCountTracesIconText' })
    expect(tracesIconText.exists()).toBe(true)
    expect(tracesIconText.props()).toMatchObject({ countTraces: ams.countTraces })
    const skillsIconText = wrapper.findComponent({ name: 'StudentCountSkillsIconText' })
    expect(skillsIconText.exists()).toBe(true)
    expect(skillsIconText.props()).toMatchObject({ countSkills: ams.countSkills })
  })

  it('should render completed status badge with completed ams', async () => {
    const wrapper = await mountWithRouter(StudentDetailedAmsCard, {
      props: { ams: amsCompleted },
      global: {
        stubs
      }
    })

    const statusBadge = wrapper.findComponent({ name: 'StudentAmsStatusBadge' })
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.props()).toMatchObject({ status: AmsStatus.COMPLETED })
  })

  it('should render in progress status badge with in progress ams', async () => {
    const wrapper = await mountWithRouter(StudentDetailedAmsCard, {
      props: { ams: amsInProgress },
      global: {
        stubs
      }
    })

    const statusBadge = wrapper.findComponent({ name: 'StudentAmsStatusBadge' })
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.props()).toMatchObject({ status: AmsStatus.IN_PROGRESS })
  })

  it('should render submitted status badge with submitted ams', async () => {
    const wrapper = await mountWithRouter(StudentDetailedAmsCard, {
      props: { ams: amsSubmitted },
      global: {
        stubs
      }
    })

    const statusBadge = wrapper.findComponent({ name: 'StudentAmsStatusBadge' })
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.props()).toMatchObject({ status: AmsStatus.SUBMITTED })
  })

  it('should render not started status badge with not started ams', async () => {
    const wrapper = await mountWithRouter(StudentDetailedAmsCard, {
      props: { ams: amsNotStarted },
      global: {
        stubs
      }
    })

    const statusBadge = wrapper.findComponent({ name: 'StudentAmsStatusBadge' })
    expect(statusBadge.exists()).toBe(true)
    expect(statusBadge.props()).toMatchObject({ status: AmsStatus.NOT_STARTED })
  })

  it('should not render acitivty count badge when totalActivityCount equals 0', async () => {
    const wrapper = await mountWithRouter(StudentDetailedAmsCard, {
      props: { ams: amsWithoutActivity },
      global: {
        stubs
      }
    })

    expect(wrapper.findComponent('.student-detailed-ams-card__ams-badge').exists()).toBe(false)
  })

  it('should render acitivty count badge when totalActivityCount is greater than 0', async () => {
    const wrapper = await mountWithRouter(StudentDetailedAmsCard, {
      props: { ams: amsWithActivities },
      global: {
        stubs
      }
    })

    expect(wrapper.findComponent('.student-detailed-ams-card__ams-badge').exists()).toBe(true)
  })
})
