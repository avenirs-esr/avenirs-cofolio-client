import { type AmsViewDTO, EAmsStatus } from '@/api/avenir-esr'
import { StudentAmsStatusBadgeStub } from '@/features/student/components/badges/StudentAmsStatusBadge/StudentAmsStatusBadge.stub'
import { StudentCountSkillsIconTextStub } from '@/features/student/components/iconTexts/StudentCountSkillsIconText/StudentCountSkillsIconText.stub'
import { StudentCountTracesIconTextStub } from '@/features/student/components/iconTexts/StudentCountTracesIconText/StudentCountTracesIconText.stub'
import StudentDetailedAmsCard from '@/features/student/views/StudentEducationAmsView/components/StudentDetailedAmsCard/StudentDetailedAmsCard.vue'
import { AvBadgeStub, DsfrBadgeStub, VIconStub } from '@avenirs-esr/avenirs-dsav'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { BddTest, mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.doMock('@avenirs-esr/avenirs-dsav', () => ({
  MDI_ICONS: {
    ATTACH_FILE: 'mdi-attach-file',
    TEST_TUBE_EMPTY: 'mdi-test-tube-empty',
  },
}))

BddTest().given('a student detailed AMS card', () => {
  let wrapper: VueWrapper

  const stubs = {
    DsfrBadge: DsfrBadgeStub,
    VIcon: VIconStub,
    AvBadge: AvBadgeStub,
    StudentCountSkillsIconText: StudentCountSkillsIconTextStub,
    StudentCountTracesIconText: StudentCountTracesIconTextStub,
    StudentAmsStatusBadge: StudentAmsStatusBadgeStub,
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
    status: EAmsStatus.IN_PROGRESS,
    progress: {
      startedActivities: 2,
      totalActivities: 4
    }
  }

  const amsCompleted: AmsViewDTO = {
    ...ams,
    status: EAmsStatus.COMPLETED
  }
  const amsInProgress: AmsViewDTO = {
    ...ams,
    status: EAmsStatus.IN_PROGRESS
  }
  const amsSubmitted: AmsViewDTO = {
    ...ams,
    status: EAmsStatus.SUBMITTED
  }
  const amsNotStarted: AmsViewDTO = {
    ...ams,
    status: EAmsStatus.NOT_STARTED
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

  BddTest().when('the component is mounted', () => {
    BddTest().then('should render properly with given props', async () => {
      wrapper = await mountWithRouter(StudentDetailedAmsCard, {
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

    BddTest().and('has a completed AMS', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter(StudentDetailedAmsCard, {
          props: { ams: amsCompleted },
          global: {
            stubs
          }
        })
      })

      BddTest().then('it should render completed status badge', () => {
        const statusBadge = wrapper.findComponent({ name: 'StudentAmsStatusBadge' })
        expect(statusBadge.exists()).toBe(true)
        expect(statusBadge.props()).toMatchObject({ status: EAmsStatus.COMPLETED })
      })
    })

    BddTest().and('has an in progress AMS', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter(StudentDetailedAmsCard, {
          props: { ams: amsInProgress },
          global: {
            stubs
          }
        })
      })

      BddTest().then('it should render in progress status badge', () => {
        const statusBadge = wrapper.findComponent({ name: 'StudentAmsStatusBadge' })
        expect(statusBadge.exists()).toBe(true)
        expect(statusBadge.props()).toMatchObject({ status: EAmsStatus.IN_PROGRESS })
      })
    })

    BddTest().and('has a submitted AMS', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter(StudentDetailedAmsCard, {
          props: { ams: amsSubmitted },
          global: {
            stubs
          }
        })
      })

      BddTest().then('it should render submitted status badge', () => {
        const statusBadge = wrapper.findComponent({ name: 'StudentAmsStatusBadge' })
        expect(statusBadge.exists()).toBe(true)
        expect(statusBadge.props()).toMatchObject({ status: EAmsStatus.SUBMITTED })
      })
    })

    BddTest().and('has a not started AMS', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter(StudentDetailedAmsCard, {
          props: { ams: amsNotStarted },
          global: {
            stubs
          }
        })
      })

      BddTest().then('it should render not started status badge', () => {
        const statusBadge = wrapper.findComponent({ name: 'StudentAmsStatusBadge' })
        expect(statusBadge.exists()).toBe(true)
        expect(statusBadge.props()).toMatchObject({ status: EAmsStatus.NOT_STARTED })
      })
    })

    BddTest().and('totalActivityCount equals 0', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter(StudentDetailedAmsCard, {
          props: { ams: amsWithoutActivity },
          global: {
            stubs
          }
        })
      })

      BddTest().then('it should not render activity count badge', () => {
        expect(wrapper.findComponent('.student-detailed-ams-card__ams-badge').exists()).toBe(false)
      })
    })

    BddTest().and('totalActivityCount is greater than 0', () => {
      beforeEach(async () => {
        wrapper = await mountWithRouter(StudentDetailedAmsCard, {
          props: { ams: amsWithActivities },
          global: {
            stubs
          }
        })
      })

      BddTest().then('it should render activity count badge', () => {
        expect(wrapper.findComponent('.student-detailed-ams-card__ams-badge').exists()).toBe(true)
      })
    })
  })
})
