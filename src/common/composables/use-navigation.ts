import { STUDENT_HOME_ROUTE } from '@/features/student'
import { TEACHER_HOME_ROUTE } from '@/features/teacher'
import { type NavigationFailure, useRouter } from 'vue-router'

export function useNavigation () {
  const router = useRouter()

  const navigateToStudentHome = () => {
    return router.push({ name: STUDENT_HOME_ROUTE })
  }

  const navigateToTeacherHome = (
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push({ name: TEACHER_HOME_ROUTE, })
  }

  return {
    navigateToStudentHome,
    navigateToTeacherHome,
  }
}
