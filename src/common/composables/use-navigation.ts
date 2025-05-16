import { studentEducationSkillsRoute, studentHomeRoute, studentMessagesRoute, studentNotificationsRoute } from '@/features/student/routes'
import { teacherHomeRoute } from '@/features/teacher/routes'
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
    return router.push(teacherHomeRoute)
  }

  return {
    navigateToStudentHome,
    navigateToStudentMessages,
    navigateToStudentNotifications,
    navigateToStudentSkills,
    navigateToTeacherHome,
  }
}
