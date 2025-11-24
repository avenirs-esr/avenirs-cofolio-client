import { ROUTE_NAMES } from '@/common/constants'
import { type NavigationFailure, useRouter } from 'vue-router'

export function useNavigation () {
  const router = useRouter()

  const navigateToStudentAdditionalSkill = () => {
    return router.push(ROUTE_NAMES.STUDENT.ADDITIONAL_SKILL)
  }

  const navigateToStudentDeliverables = () => {
    return router.push(ROUTE_NAMES.STUDENT.DELIVERABLES)
  }

  const navigateToStudentEvents = () => {
    return router.push(ROUTE_NAMES.STUDENT.EVENTS)
  }

  const navigateToStudentHome = () => {
    return router.push(ROUTE_NAMES.STUDENT.HOME)
  }

  const navigateToStudentMailbox = () => {
    return router.push(ROUTE_NAMES.STUDENT.MAILBOX)
  }

  const navigateToStudentNotifications = () => {
    return router.push(ROUTE_NAMES.STUDENT.NOTIFICATIONS)
  }

  const navigateToStudentPages = () => {
    return router.push(ROUTE_NAMES.STUDENT.TOOLS_PAGES)
  }

  const navigateToStudentResumes = () => {
    return router.push(ROUTE_NAMES.STUDENT.TOOLS_RESUMES)
  }

  const navigateToStudentSelfKnowledgeCategory = () => {
    return router.push(ROUTE_NAMES.STUDENT.SELFKNOWLEDGE_CATEGORY)
  }

  const navigateToStudentSkills = () => {
    return router.push(ROUTE_NAMES.STUDENT.EDUCATION_SKILLS)
  }

  const navigateToStudentTraces = () => {
    return router.push(ROUTE_NAMES.STUDENT.TOOLS_TRACES)
  }

  const navigateToStudentUpdateAdditionalSkill = () => {
    return router.push(ROUTE_NAMES.STUDENT.UPDATE_ADDITIONAL_SKILL)
  }

  const navigateToTeacherHome = (
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push(ROUTE_NAMES.TEACHER.HOME)
  }

  return {
    navigateToStudentAdditionalSkill,
    navigateToStudentDeliverables,
    navigateToStudentEvents,
    navigateToStudentHome,
    navigateToStudentMailbox,
    navigateToStudentNotifications,
    navigateToStudentPages,
    navigateToStudentResumes,
    navigateToStudentSelfKnowledgeCategory,
    navigateToStudentSkills,
    navigateToStudentTraces,
    navigateToStudentUpdateAdditionalSkill,
    navigateToTeacherHome,
  }
}
