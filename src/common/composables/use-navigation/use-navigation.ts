import { ROUTES } from '@/common/constants'
import { type NavigationFailure, useRouter } from 'vue-router'

export function useNavigation () {
  const router = useRouter()

  const navigateToStudentDeclaredSkill = () => {
    return router.push(ROUTES.STUDENT.DECLARED_SKILL)
  }

  const navigateToStudentDeliverables = () => {
    return router.push(ROUTES.STUDENT.DELIVERABLES)
  }

  const navigateToStudentEvents = () => {
    return router.push(ROUTES.STUDENT.EVENTS)
  }

  const navigateToStudentHome = () => {
    return router.push(ROUTES.STUDENT.HOME)
  }

  const navigateToStudentMailbox = () => {
    return router.push(ROUTES.STUDENT.MAILBOX)
  }

  const navigateToStudentNotifications = () => {
    return router.push(ROUTES.STUDENT.NOTIFICATIONS)
  }

  const navigateToStudentPages = () => {
    return router.push(ROUTES.STUDENT.TOOLS_PAGES)
  }

  const navigateToStudentResumes = () => {
    return router.push(ROUTES.STUDENT.TOOLS_RESUMES)
  }

  const navigateToStudentSelfKnowledgeCategory = ({ categoryId, elementId }: { categoryId: string, elementId: string }) => {
    return router.push({
      name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
      params: { id: categoryId },
      query: elementId ? { elementId } : undefined
    })
  }

  const navigateToStudentSelfKnowledgeElementUpdate = ({ categoryId, elementId, replace }: { categoryId: string, elementId: string, replace?: boolean }) => {
    const to = {
      name: ROUTES.STUDENT.SELFKNOWLEDGE_ELEMENT_UPDATE.name,
      params: { categoryId, elementId }
    }
    if (replace) {
      return router.replace(to)
    }
    return router.push(to)
  }

  const navigateToStudentSkills = () => {
    return router.push(ROUTES.STUDENT.EDUCATION_SKILLS)
  }

  const navigateToStudentTraces = () => {
    return router.push(ROUTES.STUDENT.TOOLS_TRACES)
  }

  const navigateToStudentUpdateDeclaredSkill = () => {
    return router.push(ROUTES.STUDENT.UPDATE_DECLARED_SKILL)
  }

  const navigateToTeacherHome = (
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push(ROUTES.TEACHER.HOME)
  }

  return {
    navigateToStudentDeclaredSkill,
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
    navigateToStudentUpdateDeclaredSkill,
    navigateToTeacherHome,
  }
}
