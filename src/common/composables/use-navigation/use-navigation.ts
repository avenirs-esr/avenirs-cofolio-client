import type { EActivityThematic } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { type NavigationFailure, useRouter } from 'vue-router'

export function useNavigation () {
  const router = useRouter()

  const navigateToAuthLogin = () => {
    return router.push(ROUTES.AUTH.LOGIN)
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

  const navigateToStudentEducationSkills = () => {
    return router.push(ROUTES.STUDENT.EDUCATION_SKILLS)
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

  const navigateToStudentTrajectories = (replace?: boolean) => {
    if (replace) {
      return router.replace(ROUTES.STUDENT.PROJECT_TRAJECTORIES)
    }
    return router.push(ROUTES.STUDENT.PROJECT_TRAJECTORIES)
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

  const navigateToStudentProjectDeclaredSkill = () => {
    return router.push(ROUTES.STUDENT.PROJECT_DECLARED_SKILL)
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

  const navigateToActivityDetailed = ({ id, thematic }: { id?: string, thematic?: string }) => {
    const to = {
      name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
      params: { id, thematic }
    }
    return router.push(to)
  }

  const navigateToStaffHome = (
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push(ROUTES.STAFF.HOME)
  }

  const navigateToStaffActivityFeedbackDetails = ({ feedbackId }: { feedbackId: string }
  ): Promise<NavigationFailure | void | undefined> => {
    return router.push({
      name: ROUTES.STAFF.ACTIVITY_FEEDBACK_DETAILS.name,
      params: { feedbackId },
    })
  }

  const navigateToStaffActivities = (replace?: boolean) => {
    if (replace) {
      return router.replace(ROUTES.STAFF.ACTIVITIES)
    }

    return router.push(ROUTES.STAFF.ACTIVITIES)
  }

  const navigateToStaffActivitiesEditNationalActivity = ({ id, mode, replace }: { id: string, mode?: string, replace?: boolean }) => {
    const to = {
      name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name,
      params: { id },
      query: mode ? { mode } : undefined
    }
    if (replace) {
      return router.replace(to)
    }
    return router.push(to)
  }

  const navigateToStaffActivityCatalog = ({ status, id }: { status: string, id: string }) => {
    return router.push({
      name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
      params: { status, id },
    })
  }

  const navigateToStaffActivityFeedbacks = ({ id }: { id: string }) => {
    return router.push({
      name: ROUTES.STAFF.ACTIVITY_FEEDBACKS.name,
      params: { id },
    })
  }

  const navigateToStudentUpdateTrace = ({ id }: { id: string }) => {
    return router.push({
      name: ROUTES.STUDENT.UPDATE_TRACE.name,
      params: { id },
    })
  }

  const navigateToStudentToolsTrace = ({ id }: { id: string }) => {
    return router.push({
      name: ROUTES.STUDENT.TOOLS_TRACE.name,
      params: { id },
    })
  }

  const navigateToStudentProjectSkill = ({ id }: { id: string }) => {
    return router.push({
      name: ROUTES.STUDENT.PROJECT_SKILL.name,
      params: { id },
    })
  }

  const navigateToStudentToolsUpdateTrace = ({ id }: { id: string }) => {
    return router.push({
      name: ROUTES.STUDENT.TOOLS_UPDATE_TRACE.name,
      params: { id },
    })
  }

  return {
    navigateToAuthLogin,
    navigateToStudentDeclaredExperience,
    navigateToStudentEducationSkills,
    navigateToStudentUpdateDeclaredExperience,
    navigateToStudentDeliverables,
    navigateToStudentEvents,
    navigateToStudentHome,
    navigateToStudentMailbox,
    navigateToStudentNotifications,
    navigateToStudentPages,
    navigateToStudentResumes,
    navigateToStudentTrajectories,
    navigateToStudentSelfKnowledgeCategory,
    navigateToStudentSelfKnowledgeElementUpdate,
    navigateToStudentProjectDeclaredSkill,
    navigateToStudentProjectSkills,
    navigateToStudentProjectActivitiesCatalog,
    navigateToStudentProjectActivities,
    navigateToStudentTraces,
    navigateToStudentDeclaredExperiences,
    navigateToStudentDeclaredPrograms,
    navigateToStudentUpdateDeclaredSkill,
    navigateToStudentUpdateDeclaredProgram,
    navigateToStaffHome,
    navigateToActivityDetailed,
    navigateToStaffActivityFeedbackDetails,
    navigateToStaffActivities,
    navigateToStaffActivitiesEditNationalActivity,
    navigateToStaffActivityCatalog,
    navigateToStaffActivityFeedbacks,
    navigateToStudentUpdateTrace,
    navigateToStudentToolsUpdateTrace,
    navigateToStudentToolsTrace,
    navigateToStudentProjectSkill,
  }
}
