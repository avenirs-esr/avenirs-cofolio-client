export const STAFF_ROUTES = {
  HOME: '/cofolio/staff',
  ACTIVITY_LIBRARY_ADD: '/cofolio/staff/activity-library/add',
}

export const STUDENT_ROUTES = {
  DELIVERABLES: '/cofolio/student/deliverables',
  EDUCATION: {
    SKILLS: '/cofolio/student/education/skills',
  },
  EVENTS: '/cofolio/student/events',
  HOME: '/cofolio/student',
  PROJECT: {
    ACTIVITIES: '/cofolio/student/project/activities',
    ACTIVITIES_CATALOG: '/cofolio/student/project/activities/catalog/:thematic/:id',
    ACTIVITY_DETAIL: '/cofolio/student/project/activities/:id',
    SKILLS: '/cofolio/student/project/skills',
    TRAJECTORIES: {
      SELF_KNOWLEDGE: '/cofolio/student/project/trajectories?section=SELF_KNOWLEDGE',
    },
  },
  DECLARED_SKILL: '/cofolio/student/declared-skill/',
  SKILL_DETAIL: '/cofolio/student/skill/',
  TRACE_DETAIL: '/cofolio/student/trace/',
  TOOLS: {
    RESUMES: '/cofolio/student/tools/resumes',
    PAGES: '/cofolio/student/tools/pages',
    TRACES: '/cofolio/student/tools/traces',
  },
} as const
