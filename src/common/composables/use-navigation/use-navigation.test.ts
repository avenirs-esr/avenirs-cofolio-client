import { useNavigation } from '@/common/composables/use-navigation/use-navigation'
import {
  studentDeliverablesRoute,
  studentEducationSkillsRoute,
  studentEventsRoute,
  studentHomeRoute,
  studentMailboxRoute,
  studentNotificationsRoute,
  studentToolsPagesRoute,
  studentToolsResumesRoute,
  studentToolsTracesRoute
} from '@/features/student/routes'
import { teacherHomeRoute } from '@/features/teacher/routes'
import { BddTest, mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn().mockImplementation((args) => {
      pushMock(args)
    }),
  }),
}))

BddTest().given('a useNavigation composable', () => {
  let navigation: ReturnType<typeof useNavigation>

  beforeEach(() => {
    pushMock.mockClear()
    vi.clearAllMocks()

    const { result } = mountComposable(useNavigation, {})
    navigation = result
  })

  BddTest().when('trying to navigate to student deliverables', () => {
    BddTest().then('it should navigate to student delivarables', () => {
      const { navigateToStudentDeliverables } = navigation
      navigateToStudentDeliverables()
      expect(pushMock).toHaveBeenCalledWith(studentDeliverablesRoute)
    })
  })

  BddTest().when('trying to navigate to student home', () => {
    BddTest().then('it should navigate to student home', () => {
      const { navigateToStudentHome } = navigation
      navigateToStudentHome()
      expect(pushMock).toHaveBeenCalledWith(studentHomeRoute)
    })
  })

  BddTest().when('trying to navigate to student events', () => {
    BddTest().then('it should navigate to student events', () => {
      const { navigateToStudentEvents } = navigation
      navigateToStudentEvents()
      expect(pushMock).toHaveBeenCalledWith(studentEventsRoute)
    })
  })

  BddTest().when('trying to navigate to student mailbox', () => {
    BddTest().then('it should navigate to student mailbox', () => {
      const { navigateToStudentMailbox } = navigation
      navigateToStudentMailbox()
      expect(pushMock).toHaveBeenCalledWith(studentMailboxRoute)
    })
  })

  BddTest().when('trying to navigate to student notifications', () => {
    BddTest().then('it should navigate to student notifications', () => {
      const { navigateToStudentNotifications } = navigation
      navigateToStudentNotifications()
      expect(pushMock).toHaveBeenCalledWith(studentNotificationsRoute)
    })
  })

  BddTest().when('trying to navigate to student pages', () => {
    BddTest().then('it should navigate to student pages', () => {
      const { navigateToStudentPages } = navigation
      navigateToStudentPages()
      expect(pushMock).toHaveBeenCalledWith(studentToolsPagesRoute)
    })
  })

  BddTest().when('trying to navigate to student resumes', () => {
    BddTest().then('it should navigate to student resumes', () => {
      const { navigateToStudentResumes } = navigation
      navigateToStudentResumes()
      expect(pushMock).toHaveBeenCalledWith(studentToolsResumesRoute)
    })
  })

  BddTest().when('trying to navigate to student skills', () => {
    BddTest().then('it should navigate to student skills', () => {
      const { navigateToStudentSkills } = navigation
      navigateToStudentSkills()
      expect(pushMock).toHaveBeenCalledWith(studentEducationSkillsRoute)
    })
  })

  BddTest().when('trying to navigate to student traces', () => {
    BddTest().then('it should navigate to student traces', () => {
      const { navigateToStudentTraces } = navigation
      navigateToStudentTraces()
      expect(pushMock).toHaveBeenCalledWith(studentToolsTracesRoute)
    })
  })

  BddTest().when('trying to navigate to teacher home', () => {
    BddTest().then('it should navigate to teacher home', () => {
      const { navigateToTeacherHome } = navigation
      navigateToTeacherHome()
      expect(pushMock).toHaveBeenCalledWith(teacherHomeRoute)
    })
  })
})
