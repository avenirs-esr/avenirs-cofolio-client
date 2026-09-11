import { ROUTES } from '@/common/constants/route-names'

export const META_BREADCRUMBS = {
  AUTH: {
    LOGIN: { textKey: 'global.home', to: ROUTES.AUTH.LOGIN },
  },
  STAFF: {
    ACTIVITIES: {
      DEFAULT: { textKey: 'staff.global.navigation.tabs.activities.header', to: ROUTES.STAFF.ACTIVITIES }
    },
    HOME: { textKey: 'staff.global.navigation.tabs.home', to: ROUTES.STAFF.HOME },
    STUDENT_TRACKING: {
      DEFAULT: { textKey: 'staff.global.navigation.tabs.studentTracking' },
      FEEDBACKS: { textKey: 'staff.global.navigation.tabs.studentFeedbacks', to: ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS }
    }
  },
  STUDENT: {
    HOME: { textKey: 'student.global.navigation.tabs.home', to: ROUTES.STUDENT.HOME },
    PROJECT: {
      ACTIVITIES: {
        textKey: 'student.global.navigation.tabs.project.items.activities',
        to: ROUTES.STUDENT.PROJECT_ACTIVITIES
      },
      BUILD_PROJECT: { textKey: 'student.global.navigation.tabs.project.items.trajectories', to: ROUTES.STUDENT.PROJECT_TRAJECTORIES },
      DEFAULT: { textKey: 'student.global.navigation.tabs.project.header' },
      PERSONAL_CAREER: {
        DECLARED_PROGRAMS: { textKey: 'student.personalCareer.views.PersonalCareerView.ProgramsSection.breadcrumb', to: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS },
        DEFAULT: { textKey: 'student.global.navigation.tabs.project.items.experiences' },
        EXPERIENCES: { textKey: 'student.personalCareer.views.PersonalCareerView.ExperiencesSection.breadcrumb', to: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES }
      },
      SELF_KNOWLEDGE: { textKey: 'student.global.navigation.tabs.project.items.selfKnowledge' },
      SKILLS: { textKey: 'student.global.navigation.tabs.project.items.skills', to: ROUTES.STUDENT.PROJECT_SKILLS },
    },
    TOOLS: {
      DEFAULT: { textKey: 'student.global.navigation.tabs.tools.header' },
      KIT: { textKey: 'student.global.navigation.tabs.tools.items.kit', to: ROUTES.STUDENT.TOOLS_KIT },
      TRACES: { textKey: 'student.global.navigation.tabs.tools.items.traces', to: ROUTES.STUDENT.TOOLS_TRACES }
    },
  },
} as const
