export const STAFF_ROUTES = {
  HOME: '/cofolio/staff',
  ACTIVITIES: '/cofolio/staff/activities',
  ACTIVITIES_EDIT_NATIONAL_ACTIVITY: '/cofolio/staff/activities/:id/edit',
  ACTIVITY_CATALOG: '/cofolio/staff/activities/:status/:id',
  STUDENT_TRACKING: {
    ACTIVITY_FEEDBACK: '/cofolio/staff/student-tracking/activity-feedbacks/:feedbackId',
    FEEDBACKS: '/cofolio/staff/student-tracking/feedbacks',
  },
}

export const STUDENT_ROUTES = {
  ACTIVITIES_CATALOG: '/cofolio/student/activities/catalog/:thematic/:id',
  ACTIVITIES: '/cofolio/student/activities',
  ACTIVITY: '/cofolio/student/activity/:id',
  DECLARED_SKILL: '/cofolio/student/declared-skill/',
  DELIVERABLES: '/cofolio/student/deliverables',
  EVENTS: '/cofolio/student/events',
  HOME: '/cofolio/student',
  PROJECT: {
    PERSONAL_CAREER: {
      EXPERIENCES: '/cofolio/student/project/personal-career/experiences',
    },
    TRAJECTORIES: {
      SELF_KNOWLEDGE: '/cofolio/student/project/trajectories?section=SELF_KNOWLEDGE',
    },
  },
  SKILLS: '/cofolio/student/skills',
  TRACE_DETAIL: '/cofolio/student/trace/',
  TOOLS: {
    KIT: '/cofolio/student/tools/kit',
    RESUMES: '/cofolio/student/tools/resumes',
    PAGES: '/cofolio/student/tools/pages',
    TRACE_DETAIL: '/cofolio/student/tools/trace/',
    TRACES: '/cofolio/student/tools/traces',
  },
  WIDGET: {
    ACTIVITY: '/cofolio/student/activity-details/:id',
    ACTIVITY_CATALOG: '/cofolio/student/activity-details/:thematic/:id',
  }
} as const
