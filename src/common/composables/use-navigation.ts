import { studentEducationSkillsRoute, studentEventsRoute, studentHomeRoute, studentMessagesRoute, studentNotificationsRoute, studentToolsPagesRoute, studentToolsResumesRoute } from '@/features/student/routes'
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

  const navigateToStudentMessages = () => {
    return router.push(studentMessagesRoute)
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

  const navigateToTeacherHome = (
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push(teacherHomeRoute)
  }

  return {
    navigateToStudentEvents,
    navigateToStudentHome,
    navigateToStudentMessages,
    navigateToStudentNotifications,
    navigateToStudentPages,
    navigateToStudentResumes,
    navigateToStudentSkills,
    navigateToTeacherHome,
  }
}
