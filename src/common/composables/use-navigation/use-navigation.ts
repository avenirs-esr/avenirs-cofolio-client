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

  const navigateToStudentSelfKnowledgeElementUpdate = ({ categoryId, elementId, replace }: { categoryId: string, elementId: string, replace?: boolean }) => {
    const to = {
      name: ROUTE_NAMES.STUDENT.SELFKNOWLEDGE_ELEMENT_UPDATE.name,
      params: { categoryId, elementId }
    }
    if (replace) {
      return router.replace(to)
    }
    return router.push(to)
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
    navigateToStudentSelfKnowledgeElementUpdate,
    navigateToStudentSkills,
    navigateToStudentTraces,
    navigateToStudentUpdateAdditionalSkill,
    navigateToTeacherHome,
  }
}
