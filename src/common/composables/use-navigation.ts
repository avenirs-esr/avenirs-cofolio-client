import { studentHomeRoute, studentMessagesRoute, studentNotificationsRoute,studentEducationSkillsRoute } from '@/features/student'
import { TEACHER_HOME_ROUTE } from '@/features/teacher'
import { type NavigationFailure, useRouter } from 'vue-router'

export function useNavigation () {
  const router = useRouter()

  const navigateToStudentHome = () => {
    return router.push(studentHomeRoute)
  }

  const navigateToStudentMessages = () => {
    return router.push(studentMessagesRoute)
  }

  const navigateToStudentNotifications = () => {
    return router.push(studentNotificationsRoute)
  }

  const navigateToStudentSkills = () => {
    return router.push(studentEducationSkillsRoute)
  }

  const navigateToTeacherHome = (
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push({ name: TEACHER_HOME_ROUTE, })
  }

  return {
    navigateToStudentHome,
    navigateToStudentMessages,
    navigateToStudentNotifications,
    navigateToStudentSkills,
    navigateToTeacherHome,
  }
}
