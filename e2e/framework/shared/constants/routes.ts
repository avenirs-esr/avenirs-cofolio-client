export const STAFF_ROUTES = {
  HOME: '/cofolio/staff',
  ACTIVITIES: '/cofolio/staff/activities',
  ACTIVITIES_EDIT_NATIONAL_ACTIVITY: '/cofolio/staff/activities/:id/edit',
  ACTIVITY_CATALOG: '/cofolio/staff/activities/:status/:id',
  ACTIVITY_FEEDBACK_DETAILS: '/cofolio/staff/activity-feedbacks/:feedbackId',
  ACTIVITY_FEEDBACKS: '/cofolio/staff/activities/:id/feedbacks',
  STUDENT_FEEDBACKS: '/cofolio/staff/student-feedbacks',
}

export const STUDENT_ROUTES = {
  DELIVERABLES: '/cofolio/student/deliverables',
  EDUCATION: {
    SKILL_DETAIL: '/cofolio/student/education/skill/',
    SKILLS: '/cofolio/student/education/skills',
  },
  EVENTS: '/cofolio/student/events',
  HOME: '/cofolio/student',
  PROJECT: {
    ACTIVITIES: '/cofolio/student/project/activities',
    ACTIVITIES_CATALOG: '/cofolio/student/project/activities/catalog/:thematic/:id',
    ACTIVITY_DETAIL: '/cofolio/student/project/activities/:id',
    DECLARED_SKILL: '/cofolio/student/project/declared-skill/',
    SKILL_DETAIL: '/cofolio/student/project/skill/',
    SKILLS: '/cofolio/student/project/skills',
    TRAJECTORIES: {
      SELF_KNOWLEDGE: '/cofolio/student/project/trajectories?section=SELF_KNOWLEDGE',
    },
  },
  SKILL_DETAIL: '/cofolio/student/skill/',
  TRACE_DETAIL: '/cofolio/student/trace/',
  TOOLS: {
    RESUMES: '/cofolio/student/tools/resumes',
    PAGES: '/cofolio/student/tools/pages',
    TRACE_DETAIL: '/cofolio/student/tools/trace/',
    TRACES: '/cofolio/student/tools/traces',
  },
} as const
