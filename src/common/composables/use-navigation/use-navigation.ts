import type { EActivityThematic } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { type NavigationFailure, type RouteLocationRaw, useRouter } from 'vue-router'

export function useNavigation () {
  const router = useRouter()

  function navigate (to: string | RouteLocationRaw, replace?: boolean) {
    return replace ? router.replace(to) : router.push(to)
  }

  const navigateToAuthLogin = () => {
    return navigate(ROUTES.AUTH.LOGIN)
  }

  const navigateToStudentActivitiesCatalog = ({ thematic, id, replace }: { thematic?: EActivityThematic, id?: string, replace?: boolean } =
  { thematic: undefined, id: undefined, replace: false }) => {
    const to = {
      name: ROUTES.STUDENT.ACTIVITIES_CATALOG.name,
      params: { thematic, id },
    }
    return navigate(to, replace)
  }

  const navigateToStudentDeclaredExperience = ({ id, replace }: { id?: string, replace?: boolean }) => {
    const to = {
      name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
      params: { id }
    }
    return navigate(to, replace)
  }

  const navigateToStudentUpdateDeclaredExperience = ({ replace }: { replace?: boolean }) => {
    return navigate(ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE, replace)
  }

  const navigateToStudentDeliverables = () => {
    return navigate(ROUTES.STUDENT.DELIVERABLES)
  }

  const navigateToStudentEvents = () => {
    return navigate(ROUTES.STUDENT.EVENTS)
  }

  const navigateToStudentHome = () => {
    return navigate(ROUTES.STUDENT.HOME)
  }

  const navigateToStudentMailbox = () => {
    return navigate(ROUTES.STUDENT.MAILBOX)
  }

  const navigateToStudentTrajectories = (replace?: boolean) => {
    return navigate(ROUTES.STUDENT.PROJECT_TRAJECTORIES, replace)
  }

  const navigateToStudentSelfKnowledgeCategory = ({ categoryId, elementId }: { categoryId: string, elementId: string }) => {
    return navigate({
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
    return navigate(to, replace)
  }

  const navigateToStudentProjectDeclaredSkill = () => {
    return navigate(ROUTES.STUDENT.PROJECT_DECLARED_SKILL)
  }

  const navigateToStudentProjectSkills = ({ replace }: { replace?: boolean }) => {
    return navigate(ROUTES.STUDENT.PROJECT_SKILLS, replace)
  }

  const navigateToStudentProjectActivitiesCatalog = ({ thematic, id, replace }: { thematic?: EActivityThematic, id?: string, replace?: boolean } =
  { thematic: undefined, id: undefined, replace: false }) => {
    const to = {
      name: ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG.name,
      params: { thematic, id },
    }
    return navigate(to, replace)
  }

  const navigateToStudentProjectActivities = ({ replace }: { replace?: boolean } =
  { replace: false }) => {
    const to = {
      name: ROUTES.STUDENT.PROJECT_ACTIVITIES.name,
    }
    return navigate(to, replace)
  }

  const navigateToStudentTrace = ({ id }: { id: string }) => {
    return navigate({
      name: ROUTES.STUDENT.TRACE.name,
      params: { id },
    })
  }

  const navigateToStudentTraces = ({ replace }: { replace?: boolean } = { replace: false }) => {
    return navigate(ROUTES.STUDENT.TOOLS_TRACES, replace)
  }

  const navigateToStudentDeclaredPrograms = ({ replace }: { replace?: boolean }) => {
    return navigate(ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS, replace)
  }

  const navigateToStudentDeclaredExperiences = ({ replace }: { replace?: boolean }) => {
    return navigate(ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES, replace)
  }

  const navigateToStudentUpdateDeclaredSkill = () => {
    return navigate(ROUTES.STUDENT.UPDATE_DECLARED_SKILL)
  }

  const navigateToStudentUpdateDeclaredProgram = () => {
    return navigate(ROUTES.STUDENT.PERSONAL_CAREER_UPDATE_DECLARED_PROGRAM)
  }

  const navigateToActivityDetailed = ({ id, thematic }: { id?: string, thematic?: string }) => {
    const to = {
      name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
      params: { id, thematic }
    }
    return navigate(to)
  }

  const navigateToStaffHome = (
  ): Promise<NavigationFailure | void | undefined> => {
    return navigate(ROUTES.STAFF.HOME)
  }

  const navigateToStaffActivityFeedbackDetails = ({ feedbackId }: { feedbackId: string }
  ): Promise<NavigationFailure | void | undefined> => {
    return navigate({
      name: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name,
      params: { feedbackId },
    })
  }

  const navigateToStaffActivities = (replace?: boolean) => {
    return navigate(ROUTES.STAFF.ACTIVITIES, replace)
  }

  const navigateToStaffActivitiesEditNationalActivity = ({ id, mode, replace }: { id: string, mode?: string, replace?: boolean }) => {
    const to = {
      name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name,
      params: { id },
      query: mode ? { mode } : undefined
    }
    return navigate(to, replace)
  }

  const navigateToStaffActivityCatalog = ({ status, id }: { status: string, id: string }) => {
    return navigate({
      name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
      params: { status, id },
    })
  }

  const navigateToStaffActivityFeedbacks = ({ id }: { id: string }) => {
    return navigate({
      name: ROUTES.STAFF.ACTIVITY_FEEDBACKS.name,
      params: { id },
    })
  }

  const navigateToStudentUpdateTrace = ({ id }: { id: string }) => {
    return navigate({
      name: ROUTES.STUDENT.UPDATE_TRACE.name,
      params: { id },
    })
  }

  const navigateToStudentToolsTrace = ({ id }: { id: string }) => {
    return navigate({
      name: ROUTES.STUDENT.TOOLS_TRACE.name,
      params: { id },
    })
  }

  const navigateToStudentToolsUpdateTrace = ({ id }: { id: string }) => {
    return navigate({
      name: ROUTES.STUDENT.TOOLS_UPDATE_TRACE.name,
      params: { id },
    })
  }

  return {
    navigateToAuthLogin,
    navigateToStudentActivitiesCatalog,
    navigateToStudentDeclaredExperience,
    navigateToStudentUpdateDeclaredExperience,
    navigateToStudentDeliverables,
    navigateToStudentEvents,
    navigateToStudentHome,
    navigateToStudentMailbox,
    navigateToStudentTrajectories,
    navigateToStudentSelfKnowledgeCategory,
    navigateToStudentSelfKnowledgeElementUpdate,
    navigateToStudentProjectDeclaredSkill,
    navigateToStudentProjectSkills,
    navigateToStudentProjectActivitiesCatalog,
    navigateToStudentProjectActivities,
    navigateToStudentTrace,
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
  }
}
