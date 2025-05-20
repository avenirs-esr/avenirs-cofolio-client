import { studentEducationSkillsRoute, studentEventsRoute, studentHomeRoute, studentMailboxRoute, studentNotificationsRoute, studentToolsPagesRoute, studentToolsResumesRoute, studentToolsTracksRoute } from '@/features/student/routes'
import { teacherHomeRoute } from '@/features/teacher/routes'
import { type NavigationFailure, useRouter } from 'vue-router'

export function useNavigation () {
  const router = useRouter()

  const navigateToStudentEvents = () => {
    return router.push(studentEventsRoute)
  }

  const navigateToStudentHome = () => {
    return router.push(studentHomeRoute)
  }

  const navigateToStudentMailbox = () => {
    return router.push(studentMailboxRoute)
  }

  const navigateToStudentNotifications = () => {
    return router.push(studentNotificationsRoute)
  }

  const navigateToStudentPages = () => {
    return router.push(studentToolsPagesRoute)
  }

  const navigateToStudentResumes = () => {
    return router.push(studentToolsResumesRoute)
  }

  const navigateToStudentSkills = () => {
    return router.push(studentEducationSkillsRoute)
  }

  const navigateToStudentTracks = () => {
    return router.push(studentToolsTracksRoute)
  }

  const navigateToTeacherHome = (
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push(teacherHomeRoute)
  }

  return {
    navigateToStudentEvents,
    navigateToStudentHome,
    navigateToStudentMailbox,
    navigateToStudentNotifications,
    navigateToStudentPages,
    navigateToStudentResumes,
    navigateToStudentSkills,
    navigateToStudentTracks,
    navigateToTeacherHome,
  }
}
