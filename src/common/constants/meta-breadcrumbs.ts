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
    ACTIVITIES: {
      textKey: 'student.global.navigation.tabs.activities',
      to: ROUTES.STUDENT.ACTIVITIES
    },
    HOME: { textKey: 'student.global.navigation.tabs.home', to: ROUTES.STUDENT.HOME },
    PROJECT: {
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

const BASE_STAFF_STUDENT_TRACKING_BREADCRUMBS = [
  META_BREADCRUMBS.STAFF.HOME,
  META_BREADCRUMBS.STAFF.STUDENT_TRACKING.DEFAULT
]

const BASE_STUDENT_PROJECT_BREADCRUMBS = [
  META_BREADCRUMBS.STUDENT.HOME,
  META_BREADCRUMBS.STUDENT.PROJECT.DEFAULT,
]

const BASE_STUDENT_PROJECT_PERSONAL_CAREER_BREADCRUMBS = [
  ...BASE_STUDENT_PROJECT_BREADCRUMBS,
  META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DEFAULT,
]

const BASE_STUDENT_TOOLS_BREADCRUMBS = [
  META_BREADCRUMBS.STUDENT.HOME,
  META_BREADCRUMBS.STUDENT.TOOLS.DEFAULT,
]

export const BASE_BREADCRUMBS = {
  AUTH: {
    LOGIN: [
      META_BREADCRUMBS.AUTH.LOGIN,
    ]
  },
  STAFF: {
    HOME: {
      ACTIVITIES: [
        META_BREADCRUMBS.STAFF.HOME,
        META_BREADCRUMBS.STAFF.ACTIVITIES.DEFAULT
      ],
      BASE: [META_BREADCRUMBS.STAFF.HOME],
      FEEDBACKS: [
        META_BREADCRUMBS.STAFF.HOME,
        { textKey: META_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS.textKey },
      ]
    },
    STUDENT_TRACKING: {
      FEEDBACKS: {
        BASE: [
          ...BASE_STAFF_STUDENT_TRACKING_BREADCRUMBS,
          META_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS
        ],
        WITHOUT_LINK: [
          ...BASE_STAFF_STUDENT_TRACKING_BREADCRUMBS,
          { textKey: META_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS.textKey }
        ]
      },
    }
  },
  STUDENT: {
    HOME: {
      BASE: [META_BREADCRUMBS.STUDENT.HOME],
      TRACES: [
        META_BREADCRUMBS.STUDENT.HOME,
        { textKey: META_BREADCRUMBS.STUDENT.TOOLS.TRACES.textKey },
      ]
    },
    ACTIVITIES: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.ACTIVITIES,
    ],
    PROJECT: {
      BUILD_PROJECT: {
        BUILD_PROJECT: [
          ...BASE_STUDENT_PROJECT_BREADCRUMBS,
          { textKey: META_BREADCRUMBS.STUDENT.PROJECT.BUILD_PROJECT.textKey },
        ],
        SELF_KNOWLEDGE: [
          ...BASE_STUDENT_PROJECT_BREADCRUMBS,
          META_BREADCRUMBS.STUDENT.PROJECT.BUILD_PROJECT,
          META_BREADCRUMBS.STUDENT.PROJECT.SELF_KNOWLEDGE,
        ]
      },
      PERSONAL_CAREER: {
        BASE: [
          ...BASE_STUDENT_PROJECT_PERSONAL_CAREER_BREADCRUMBS,
        ],
        DECLARED_PROGRAMS: [
          ...BASE_STUDENT_PROJECT_PERSONAL_CAREER_BREADCRUMBS,
          META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.DECLARED_PROGRAMS,
        ],
        EXPERIENCES: [
          ...BASE_STUDENT_PROJECT_PERSONAL_CAREER_BREADCRUMBS,
          META_BREADCRUMBS.STUDENT.PROJECT.PERSONAL_CAREER.EXPERIENCES,
        ],
      },
      SKILLS: [
        ...BASE_STUDENT_PROJECT_BREADCRUMBS,
        META_BREADCRUMBS.STUDENT.PROJECT.SKILLS,
      ]
    },
    TOOLS: {
      KIT: [
        ...BASE_STUDENT_TOOLS_BREADCRUMBS,
        META_BREADCRUMBS.STUDENT.TOOLS.KIT,
      ],
      TRACES: [
        ...BASE_STUDENT_TOOLS_BREADCRUMBS,
        META_BREADCRUMBS.STUDENT.TOOLS.TRACES,
      ]
    },
    WIDGETS: {
      ACTIVITIES: [
        META_BREADCRUMBS.STUDENT.HOME,
        { textKey: META_BREADCRUMBS.STUDENT.ACTIVITIES.textKey },
      ]
    }
  }
}
