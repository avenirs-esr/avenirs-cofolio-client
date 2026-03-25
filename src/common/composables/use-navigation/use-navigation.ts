import type { EActivityThematic } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { type NavigationFailure, useRouter } from 'vue-router'

export function useNavigation () {
  const router = useRouter()

  const navigateToStudentDeclaredSkill = () => {
    return router.push(ROUTES.STUDENT.DECLARED_SKILL)
  }

  const navigateToStudentDeclaredExperience = ({ id, replace }: { id?: string, replace?: boolean }) => {
    const to = {
      name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
      params: { id }
    }
    if (replace) {
      return router.replace(to)
    }
    return router.push(to)
  }

  const navigateToStudentUpdateDeclaredExperience = ({ replace }: { replace?: boolean }) => {
    if (replace) {
      return router.replace(ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE)
    }
    return router.push(ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE)
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

  const navigateToStudentProjectSkills = ({ replace }: { replace?: boolean }) => {
    if (replace) {
      return router.replace(ROUTES.STUDENT.PROJECT_SKILLS)
    }
    return router.push(ROUTES.STUDENT.PROJECT_SKILLS)
  }

  const navigateToStudentProjectActivitiesCatalog = ({ thematic, id, replace }: { thematic?: EActivityThematic, id?: string, replace?: boolean } =
  { thematic: undefined, id: undefined, replace: false }) => {
    const to = {
      name: ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG.name,
      params: { thematic, id },
    }
    if (replace) {
      return router.replace(to)
    }
    return router.push(to)
  }

  const navigateToStudentProjectActivities = ({ replace }: { replace?: boolean } =
  { replace: false }) => {
    const to = {
      name: ROUTES.STUDENT.PROJECT_ACTIVITIES.name,
    }
    if (replace) {
      return router.replace(to)
    }
    return router.push(to)
  }

  const navigateToStudentTraces = ({ replace }: { replace?: boolean } = { replace: false }) => {
    if (replace) {
      return router.replace(ROUTES.STUDENT.TOOLS_TRACES)
    }

    return router.push(ROUTES.STUDENT.TOOLS_TRACES)
  }

  const navigateToStudentDeclaredPrograms = ({ replace }: { replace?: boolean }) => {
    if (replace) {
      return router.replace(ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS)
    }
    return router.push(ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS)
  }

  const navigateToStudentDeclaredExperiences = ({ replace }: { replace?: boolean }) => {
    if (replace) {
      return router.replace(ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES)
    }
    return router.push(ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES)
  }

  const navigateToStudentUpdateDeclaredSkill = () => {
    return router.push(ROUTES.STUDENT.UPDATE_DECLARED_SKILL)
  }

  const navigateToStudentUpdateDeclaredProgram = () => {
    return router.push(ROUTES.STUDENT.PERSONAL_CAREER_UPDATE_DECLARED_PROGRAM)
  }

  const navigateToTeacherHome = (
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push(ROUTES.TEACHER.HOME)
  }

  const navigateToActivityDetailed = ({ id, thematic }: { id?: string, thematic?: string }) => {
    const to = {
      name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
      params: { id, thematic }
    }
    return router.push(to)
  }

  return {
    navigateToStudentDeclaredSkill,
    navigateToStudentDeclaredExperience,
    navigateToStudentUpdateDeclaredExperience,
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
    navigateToStudentProjectSkills,
    navigateToStudentProjectActivitiesCatalog,
    navigateToStudentProjectActivities,
    navigateToStudentTraces,
    navigateToStudentDeclaredExperiences,
    navigateToStudentDeclaredPrograms,
    navigateToStudentUpdateDeclaredSkill,
    navigateToStudentUpdateDeclaredProgram,
    navigateToTeacherHome,
    navigateToActivityDetailed,
  }
}
