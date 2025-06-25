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
import { describe, expect, it } from 'vitest'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn().mockImplementation((args) => {
      pushMock(args)
    }),
  }),
}))

describe('useNavigation', () => {
  beforeEach(() => {
    pushMock.mockClear()
    vi.clearAllMocks()
  })

  it('should navigate to student delivarables', () => {
    const { navigateToStudentDeliverables } = useNavigation()
    navigateToStudentDeliverables()
    expect(pushMock).toHaveBeenCalledWith(studentDeliverablesRoute)
  })

  it('should navigate to student events', () => {
    const { navigateToStudentEvents } = useNavigation()
    navigateToStudentEvents()
    expect(pushMock).toHaveBeenCalledWith(studentEventsRoute)
  })

  it('should navigate to student home', () => {
    const { navigateToStudentHome } = useNavigation()
    navigateToStudentHome()
    expect(pushMock).toHaveBeenCalledWith(studentHomeRoute)
  })

  it('should navigate to student mailbox', () => {
    const { navigateToStudentMailbox } = useNavigation()
    navigateToStudentMailbox()
    expect(pushMock).toHaveBeenCalledWith(studentMailboxRoute)
  })

  it('should navigate to student notifications', () => {
    const { navigateToStudentNotifications } = useNavigation()
    navigateToStudentNotifications()
    expect(pushMock).toHaveBeenCalledWith(studentNotificationsRoute)
  })

  it('should navigate to student pages', () => {
    const { navigateToStudentPages } = useNavigation()
    navigateToStudentPages()
    expect(pushMock).toHaveBeenCalledWith(studentToolsPagesRoute)
  })

  it('should navigate to student resumes', () => {
    const { navigateToStudentResumes } = useNavigation()
    navigateToStudentResumes()
    expect(pushMock).toHaveBeenCalledWith(studentToolsResumesRoute)
  })

  it('should navigate to student skills', () => {
    const { navigateToStudentSkills } = useNavigation()
    navigateToStudentSkills()
    expect(pushMock).toHaveBeenCalledWith(studentEducationSkillsRoute)
  })

  it('should navigate to student traces', () => {
    const { navigateToStudentTraces } = useNavigation()
    navigateToStudentTraces()
    expect(pushMock).toHaveBeenCalledWith(studentToolsTracesRoute)
  })

  it('should navigate to teacher home', () => {
    const { navigateToTeacherHome } = useNavigation()
    navigateToTeacherHome()
    expect(pushMock).toHaveBeenCalledWith(teacherHomeRoute)
  })
})
