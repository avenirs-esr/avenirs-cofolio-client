export const STUDENT_ROUTES = {
  DELIVERABLES: '/cofolio/student/deliverables',
  EDUCATION: {
    SKILLS: '/cofolio/student/education/skills',
  },
  EVENTS: '/cofolio/student/events',
  HOME: '/cofolio/student',
  PROJECT: {
    ACTIVITIES: '/cofolio/student/project/activities',
    ACTIVITIES_CATALOG: '/cofolio/student/project/activities/catalog/:theme/:id',
    TRAJECTORIES: {
      SELF_KNOWLEDGE: '/cofolio/student/project/trajectories?section=SELF_KNOWLEDGE',
    },
  },
  SKILL_DETAIL: '/cofolio/student/skill/',
  TOOLS: {
    RESUMES: '/cofolio/student/tools/resumes',
    PAGES: '/cofolio/student/tools/pages',
    TRACES: '/cofolio/student/tools/traces',
  },
} as const
