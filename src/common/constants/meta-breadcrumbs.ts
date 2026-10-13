import { ROUTES } from '@/common/constants/route-names'

/**
 * Breadcrumb metadata organized by application module.
 */
export const META_BREADCRUMBS = {
  /**
   * Breadcrumb metadata for the auth module.
   */
  AUTH: {
    LOGIN: { textKey: 'global.home', to: ROUTES.AUTH.LOGIN },
  },

  /**
   * Breadcrumb metadata for the staff module.
   */
  STAFF: {
    /**
     * Breadcrumb metadata for the staff activities submodule.
     */
    ACTIVITIES: {
      DEFAULT: { textKey: 'staff.global.navigation.tabs.activities.header', to: ROUTES.STAFF.ACTIVITIES },
    },

    /**
     * Breadcrumb metadata for the staff admin submodule.
     */
    ADMIN: {
      DEFAULT: { textKey: 'staff.global.navigation.tabs.admin.header' },
      GROUPS: { textKey: 'staff.global.navigation.tabs.admin.items.groups', to: ROUTES.STAFF.ADMIN.GROUPS },
      SKILLS: { textKey: 'staff.global.navigation.tabs.admin.items.skills', to: ROUTES.STAFF.ADMIN.SKILLS },
      USERS: { textKey: 'staff.global.navigation.tabs.admin.items.users', to: ROUTES.STAFF.ADMIN.USERS },
    },

    /**
     * Breadcrumb metadata for the staff home submodule.
     */
    HOME: { textKey: 'staff.global.navigation.tabs.home', to: ROUTES.STAFF.HOME },

    /**
     * Breadcrumb metadata for the staff student tracking submodule.
     */
    STUDENT_TRACKING: {
      DEFAULT: { textKey: 'staff.global.navigation.tabs.studentTracking' },
      FEEDBACKS: { textKey: 'staff.global.navigation.tabs.studentFeedbacks', to: ROUTES.STAFF.STUDENT_TRACKING.FEEDBACKS },
    },
  },

  /**
   * Breadcrumb metadata for the student module.
   */
  STUDENT: {
    /**
     * Breadcrumb metadata for the student activities submodule.
     */
    ACTIVITIES: {
      textKey: 'student.global.navigation.tabs.activities',
      to: ROUTES.STUDENT.ACTIVITIES,
    },

    /**
     * Breadcrumb metadata for the student home submodule.
     */
    HOME: { textKey: 'student.global.navigation.tabs.home', to: ROUTES.STUDENT.HOME },

    /**
     * Breadcrumb metadata for the student project submodule.
     */
    PROJECT: {
      BUILD_PROJECT: { textKey: 'student.global.navigation.tabs.project.items.buildProject', to: ROUTES.STUDENT.BUILD_PROJECT },
      DEFAULT: { textKey: 'student.global.navigation.tabs.project.header' },
      PERSONAL_CAREER: {
        DECLARED_PROGRAMS: {
          textKey: 'student.personalCareer.views.PersonalCareerView.ProgramsSection.breadcrumb',
          to: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS,
        },
        DEFAULT: { textKey: 'student.global.navigation.tabs.project.items.experiences' },
        EXPERIENCES: {
          textKey: 'student.personalCareer.views.PersonalCareerView.ExperiencesSection.breadcrumb',
          to: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES,
        },
      },
      SELF_KNOWLEDGE: { textKey: 'student.global.navigation.tabs.project.items.selfKnowledge' },
    },

    /**
     * Breadcrumb metadata for the student skills submodule.
     */
    SKILLS: { textKey: 'student.global.navigation.tabs.skills', to: ROUTES.STUDENT.SKILLS },

    /**
     * Breadcrumb metadata for the student tools submodule.
     */
    TOOLS: {
      DEFAULT: { textKey: 'student.global.navigation.tabs.tools.header' },
      KIT: {
        ACTIVITIES: {
          textKey: 'student.global.navigation.tabs.activities',
          to: {
            name: ROUTES.STUDENT.TOOLS_KIT_ACTIVITIES.name,
            path: ROUTES.STUDENT.TOOLS_KIT_ACTIVITIES.path,
            query: { tab: 'ACTIVITY_LIBRARY' }
          }
        },
        BASE: { textKey: 'student.global.navigation.tabs.tools.items.kit', to: ROUTES.STUDENT.TOOLS_KIT },
        DECLARED_PROGRAMS: {
          textKey: 'student.personalCareer.views.PersonalCareerView.ProgramsSection.breadcrumb',
          to: ROUTES.STUDENT.TOOLS_KIT_DECLARED_PROGRAMS
        },
        EXPERIENCES: {
          textKey: 'student.personalCareer.views.PersonalCareerView.ExperiencesSection.breadcrumb',
          to: ROUTES.STUDENT.TOOLS_KIT_EXPERIENCES
        },
        SKILLS: { textKey: 'student.global.navigation.tabs.skills', to: ROUTES.STUDENT.TOOLS_KIT_SKILLS },
      },
      TRACES: { textKey: 'student.global.navigation.tabs.tools.items.traces', to: ROUTES.STUDENT.TOOLS_TRACES },
    },
  },
} as const

// -----------------------------------------------
// Reusable breadcrumb paths for BASE_BREADCRUMBS
// -----------------------------------------------

// STAFF ADMIN
const BASE_STAFF_ADMIN_BREADCRUMBS = [META_BREADCRUMBS.STAFF.HOME, META_BREADCRUMBS.STAFF.ADMIN.DEFAULT]

// STAFF STUDENT TRACKING
const BASE_STAFF_STUDENT_TRACKING_BREADCRUMBS = [META_BREADCRUMBS.STAFF.HOME, META_BREADCRUMBS.STAFF.STUDENT_TRACKING.DEFAULT]

// STUDENT PROJECT
const BASE_STUDENT_PROJECT_BREADCRUMBS = [META_BREADCRUMBS.STUDENT.HOME, META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT]
const BASE_STUDENT_PROJECT_PERSONAL_CAREER_BREADCRUMBS = [
  ...BASE_STUDENT_PROJECT_BREADCRUMBS,
  META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DEFAULT,
]

// STUDENT TOOLS
const BASE_STUDENT_TOOLS_BREADCRUMBS = [META_BREADCRUMBS.STUDENT.HOME, META_BREADCRUMBS.STUDENT.TOOLS.DEFAULT]
const BASE_STUDENT_TOOLS_KIT_BREADCRUMBS = [...BASE_STUDENT_TOOLS_BREADCRUMBS, META_BREADCRUMBS.STUDENT.TOOLS.KIT.BASE]
const BASE_STUDENT_TOOLS_KIT_SKILLS_BREADCRUMBS = [
  ...BASE_STUDENT_TOOLS_KIT_BREADCRUMBS,
  META_BREADCRUMBS.STUDENT.TOOLS.KIT.SKILLS
]
const BASE_STUDENT_TOOLS_KIT_BUILD_PROJECT_BREADCRUMBS = [
  ...BASE_STUDENT_TOOLS_KIT_BREADCRUMBS,
  { textKey: META_BREADCRUMBS.STUDENT.PROJECT.BUILD_PROJECT.textKey }
]
const BASE_STUDENT_TOOLS_KIT_PERSONAL_CAREER_BREADCRUMBS = [
  ...BASE_STUDENT_TOOLS_KIT_BREADCRUMBS,
  { textKey: META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DEFAULT.textKey }
]

/**
 * Breadcrumb paths organized by application module.
 */
export const BASE_BREADCRUMBS = {
  /**
   * Breadcrumb paths for the authentication module.
   */
  AUTH: {
    LOGIN: [META_BREADCRUMBS.AUTH.LOGIN],
  },

  /**
   * Breadcrumb paths for the staff module.
   */
  STAFF: {
    /**
     * Breadcrumb paths for staff admin submodule.
     */
    ADMIN: {
      GROUPS: [...BASE_STAFF_ADMIN_BREADCRUMBS, META_BREADCRUMBS.STAFF.ADMIN.GROUPS],
      SKILLS: [...BASE_STAFF_ADMIN_BREADCRUMBS, META_BREADCRUMBS.STAFF.ADMIN.SKILLS],
      USERS: [...BASE_STAFF_ADMIN_BREADCRUMBS, META_BREADCRUMBS.STAFF.ADMIN.USERS],
    },

    /**
     * Breadcrumb paths for staff home submodule.
     */
    HOME: {
      ACTIVITIES: [META_BREADCRUMBS.STAFF.HOME, META_BREADCRUMBS.STAFF.ACTIVITIES.DEFAULT],
      BASE: [META_BREADCRUMBS.STAFF.HOME],
      FEEDBACKS: [META_BREADCRUMBS.STAFF.HOME, { textKey: META_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS.textKey }],
    },

    /**
     * Breadcrumb paths for staff student tracking submodule.
     */
    STUDENT_TRACKING: {
      FEEDBACKS: {
        BASE: [...BASE_STAFF_STUDENT_TRACKING_BREADCRUMBS, META_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS],
        WITHOUT_LINK: [...BASE_STAFF_STUDENT_TRACKING_BREADCRUMBS, { textKey: META_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS.textKey }],
      },
    },
  },

  /**
   * Breadcrumb paths for the student module.
   */
  STUDENT: {
    /**
     * Breadcrumb paths for the student home submodule.
     */
    HOME: {
      BASE: [META_BREADCRUMBS.STUDENT.HOME],
      TRACES: [META_BREADCRUMBS.STUDENT.HOME, { textKey: META_BREADCRUMBS.STUDENT.TOOLS.TRACES.textKey }],
    },

    /**
     * Breadcrumb paths for the student activities submodule.
     */
    ACTIVITIES: [META_BREADCRUMBS.STUDENT.HOME, META_BREADCRUMBS.STUDENT.ACTIVITIES],

    /**
     * Breadcrumb paths for the student project submodule.
     */
    PROJECT: {
      LIFE_PROJECT: {
        BUILD_PROJECT: [...BASE_STUDENT_PROJECT_BREADCRUMBS, { textKey: META_BREADCRUMBS.STUDENT.PROJECT.BUILD_PROJECT.textKey }],
        SELF_KNOWLEDGE: [
          ...BASE_STUDENT_PROJECT_BREADCRUMBS,
          META_BREADCRUMBS.STUDENT.PROJECT.BUILD_PROJECT,
          META_BREADCRUMBS.STUDENT.PROJECT.SELF_KNOWLEDGE,
        ],
      },
      PERSONAL_CAREER: {
        BASE: [...BASE_STUDENT_PROJECT_PERSONAL_CAREER_BREADCRUMBS],
        DECLARED_PROGRAMS: [
          ...BASE_STUDENT_PROJECT_PERSONAL_CAREER_BREADCRUMBS,
          META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DECLARED_PROGRAMS,
        ],
        EXPERIENCES: [...BASE_STUDENT_PROJECT_PERSONAL_CAREER_BREADCRUMBS, META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.EXPERIENCES],
      },
    },

    /**
     * Breadcrumb paths for the student skills submodule.
     */
    SKILLS: [META_BREADCRUMBS.STUDENT.HOME, META_BREADCRUMBS.STUDENT.SKILLS],

    /**
     * Breadcrumb paths for the student tools submodule.
     */
    TOOLS: {
      KIT: {
        ACTIVITIES: [
          ...BASE_STUDENT_TOOLS_KIT_BREADCRUMBS,
          META_BREADCRUMBS.STUDENT.TOOLS.KIT.ACTIVITIES,
        ],
        BASE: [...BASE_STUDENT_TOOLS_KIT_BREADCRUMBS],
        BUILD_PROJECT: [...BASE_STUDENT_TOOLS_KIT_BUILD_PROJECT_BREADCRUMBS],
        PERSONAL_CAREER: {
          BASE: [...BASE_STUDENT_TOOLS_KIT_PERSONAL_CAREER_BREADCRUMBS],
          DECLARED_PROGRAMS: [
            ...BASE_STUDENT_TOOLS_KIT_PERSONAL_CAREER_BREADCRUMBS,
            META_BREADCRUMBS.STUDENT.TOOLS.KIT.DECLARED_PROGRAMS
          ],
          EXPERIENCES: [
            ...BASE_STUDENT_TOOLS_KIT_PERSONAL_CAREER_BREADCRUMBS,
            META_BREADCRUMBS.STUDENT.TOOLS.KIT.EXPERIENCES
          ]
        },
        SELF_KNOWLEDGE: [...BASE_STUDENT_TOOLS_KIT_BUILD_PROJECT_BREADCRUMBS, { textKey: META_BREADCRUMBS.STUDENT.PROJECT.SELF_KNOWLEDGE.textKey }],
        SKILLS: [...BASE_STUDENT_TOOLS_KIT_SKILLS_BREADCRUMBS],
        TRACES: [...BASE_STUDENT_TOOLS_KIT_BREADCRUMBS, { textKey: META_BREADCRUMBS.STUDENT.TOOLS.TRACES.textKey }],
      },
      TRACES: [...BASE_STUDENT_TOOLS_BREADCRUMBS, META_BREADCRUMBS.STUDENT.TOOLS.TRACES],
    },

    /**
     * Breadcrumb paths for the student widgets submodule.
     */
    WIDGETS: {
      ACTIVITIES: [META_BREADCRUMBS.STUDENT.HOME, { textKey: META_BREADCRUMBS.STUDENT.ACTIVITIES.textKey }],
    },
  },
}
