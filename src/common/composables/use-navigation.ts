import { STUDENT_HOME_ROUTE } from '@/features/student'
import { STUDENT_EDUCATION_SKILLS_ROUTE, STUDENT_MESSAGES_ROUTE, STUDENT_NOTIFICATIONS_ROUTE } from '@/features/student/routes'
import { TEACHER_HOME_ROUTE } from '@/features/teacher'
import { type NavigationFailure, useRouter } from 'vue-router'

export function useNavigation () {
  const router = useRouter()

  const navigateToStudentHome = () => {
    return router.push({ name: STUDENT_HOME_ROUTE })
  }

  const navigateToStudentMessages = () => {
    return router.push({ name: STUDENT_MESSAGES_ROUTE })
  }

  const navigateToStudentNotifications = () => {
    return router.push({ name: STUDENT_NOTIFICATIONS_ROUTE })
  }

  const navigateToStudentSkills = () => {
    return router.push({ name: STUDENT_EDUCATION_SKILLS_ROUTE })
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
