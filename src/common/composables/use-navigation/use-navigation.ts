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
import { type NavigationFailure, useRouter } from 'vue-router'

export function useNavigation () {
  const router = useRouter()

  const navigateToStudentDeliverables = () => {
    return router.push(studentDeliverablesRoute)
  }

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

  const navigateToStudentTraces = () => {
    return router.push(studentToolsTracesRoute)
  }

  const navigateToTeacherHome = (
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push(teacherHomeRoute)
  }

  return {
    navigateToStudentDeliverables,
    navigateToStudentEvents,
    navigateToStudentHome,
    navigateToStudentMailbox,
    navigateToStudentNotifications,
    navigateToStudentPages,
    navigateToStudentResumes,
    navigateToStudentSkills,
    navigateToStudentTraces,
    navigateToTeacherHome,
  }
}
