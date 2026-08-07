export const STAFF_ROUTES = {
  HOME: '/cofolio/staff',
  ACTIVITIES: '/cofolio/staff/activities',
  ACTIVITIES_EDIT_NATIONAL_ACTIVITY: '/cofolio/staff/activities/:id/edit',
  ACTIVITY_CATALOG: '/cofolio/staff/activities/:status/:id',
  ACTIVITY_FEEDBACKS: '/cofolio/staff/activities/:id/feedbacks',
  STUDENT_TRACKING: {
    ACTIVITY_FEEDBACK: '/cofolio/staff/student-tracking/activity-feedbacks/:feedbackId',
    FEEDBACKS: '/cofolio/staff/student-tracking/feedbacks',
  },
}

export const STUDENT_ROUTES = {
  ACTIVITY: '/cofolio/student/activity/',
  DELIVERABLES: '/cofolio/student/deliverables',
  EVENTS: '/cofolio/student/events',
  HOME: '/cofolio/student',
  PROJECT: {
    ACTIVITIES: '/cofolio/student/project/activities',
    ACTIVITIES_CATALOG: '/cofolio/student/project/activities/catalog/:thematic/:id',
    ACTIVITY_DETAIL: '/cofolio/student/project/activities/:id',
    DECLARED_SKILL: '/cofolio/student/project/declared-skill/',
    PERSONAL_CAREER: {
      EXPERIENCES: '/cofolio/student/project/personal-career/experiences',
    },
    SKILLS: '/cofolio/student/project/skills',
    TRAJECTORIES: {
      SELF_KNOWLEDGE: '/cofolio/student/project/trajectories?section=SELF_KNOWLEDGE',
    },
  },
  TRACE_DETAIL: '/cofolio/student/trace/',
  TOOLS: {
    KIT: '/cofolio/student/tools/kit',
    RESUMES: '/cofolio/student/tools/resumes',
    PAGES: '/cofolio/student/tools/pages',
    TRACE_DETAIL: '/cofolio/student/tools/trace/',
    TRACES: '/cofolio/student/tools/traces',
  },
} as const
