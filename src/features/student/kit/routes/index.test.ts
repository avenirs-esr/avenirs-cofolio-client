import type { AvRoute } from '@/common/types'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import StudentDeclaredSkillView from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'
import StudentUpdateDeclaredSkillView from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/StudentUpdateDeclaredSkillView.vue'
import StudentBuildProjectView from '@/features/student/global/views/StudentBuildProjectView/StudentBuildProjectView.vue'
import {
  studentToolsKitBuildProjectRoute,
  studentToolsKitDeclaredProgramRoute,
  studentToolsKitExperienceRoute,
  studentToolsKitPersonalCareerRoute,
  studentToolsKitRoute,
  studentToolsKitSelfKnowledgeCategoryRoute,
  studentToolsKitSelfKnowledgeElementUpdateRoute,
  studentToolsKitSkillRoute,
  studentToolsKitSkillsRoute,
  studentToolsKitTraceRoute,
  studentToolsKitUpdateDeclaredProgramRoute,
  studentToolsKitUpdateSkillRoute,
  studentToolsKitUpdateTraceRoute,
} from '@/features/student/kit/routes'
import StudentToolsKitView from '@/features/student/kit/views/StudentToolsKitView/StudentToolsKitView.vue'
import DeclaredExperienceView from '@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'
import DeclaredProgramDetailedView from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'
import DeclaredProgramUpdateView from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/DeclaredProgramUpdateView.vue'
import PersonalCareerView from '@/features/student/personalCareer/views/PersonalCareerView/PersonalCareerView.vue'
import ExperiencesSection from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/ExperiencesSection.vue'
import ProgramsSection from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/ProgramsSection.vue'
import SelfKnowledgeCategoryView from '@/features/student/selfKnowledge/views/SelfKnowledgeCategoryView/SelfKnowledgeCategoryView.vue'
import SelfKnowledgeElementUpdateView from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/SelfKnowledgeElementUpdateView.vue'
import StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import StudentTraceView from '@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'
import StudentUpdateTraceView from '@/features/student/traces/views/StudentUpdateTraceView/StudentUpdateTraceView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentToolsKitRoute,
  {
    path: 'tools/kit',
    name: 'student-tools-kit',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.BASE },
  },
  StudentToolsKitView
)

testRoute(
  studentToolsKitSkillsRoute,
  {
    path: 'tools/kit/skills',
    name: 'student-tools-kit-skills',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.SKILLS },
  },
  StudentProjectSkillsView
)

testRoute(
  studentToolsKitSkillRoute,
  {
    path: 'tools/kit/skill/:id',
    name: 'student-tools-kit-skill',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.SKILLS },
  },
  StudentDeclaredSkillView
)

testRoute(
  studentToolsKitUpdateSkillRoute,
  {
    path: 'tools/kit/update-skill/:id',
    name: 'student-tools-kit-update-skill',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.SKILLS },
  },
  StudentUpdateDeclaredSkillView
)

testRoute(
  studentToolsKitPersonalCareerRoute,
  {
    path: 'tools/kit/personal-career',
    name: 'student-tools-kit-personal-career',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.PERSONAL_CAREER.BASE },
    redirect: { name: 'student-tools-kit-personal-career' },
  },
  PersonalCareerView
)

const personalCareerChildren = studentToolsKitPersonalCareerRoute.children as AvRoute[]

testRoute(
  personalCareerChildren[0],
  {
    path: 'tools/kit/declared-programs',
    name: 'student-tools-kit-declared-programs',
  },
  ProgramsSection
)

testRoute(
  personalCareerChildren[1],
  {
    path: 'tools/kit/experiences',
    name: 'student-tools-kit-experiences',
  },
  ExperiencesSection
)

testRoute(
  studentToolsKitDeclaredProgramRoute,
  {
    path: 'tools/kit/declared-program/:id',
    name: 'student-tools-kit-declared-program',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.PERSONAL_CAREER.DECLARED_PROGRAMS },
  },
  DeclaredProgramDetailedView
)

testRoute(
  studentToolsKitUpdateDeclaredProgramRoute,
  {
    path: 'tools/kit/update-declared-program/:id',
    name: 'student-tools-kit-update-declared-program',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.PERSONAL_CAREER.DECLARED_PROGRAMS },
  },
  DeclaredProgramUpdateView
)

testRoute(
  studentToolsKitExperienceRoute,
  {
    path: 'tools/kit/experience/:id',
    name: 'student-tools-kit-experience',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.PERSONAL_CAREER.EXPERIENCES },
  },
  DeclaredExperienceView
)

testRoute(
  studentToolsKitBuildProjectRoute,
  {
    path: 'tools/kit/build-project',
    name: 'student-tools-kit-build-project',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.BUILD_PROJECT },
  },
  StudentBuildProjectView
)

testRoute(
  studentToolsKitSelfKnowledgeCategoryRoute,
  {
    path: 'tools/kit/self-knowledge/:id',
    name: 'student-tools-kit-self-knowledge-category',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.SELF_KNOWLEDGE },
  },
  SelfKnowledgeCategoryView
)

testRoute(
  studentToolsKitSelfKnowledgeElementUpdateRoute,
  {
    path: 'tools/kit/self-knowledge/:categoryId/:elementId/update',
    name: 'student-tools-kit-self-knowledge-element-update',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.SELF_KNOWLEDGE },
  },
  SelfKnowledgeElementUpdateView
)

testRoute(
  studentToolsKitTraceRoute,
  {
    path: 'tools/kit/trace/:id',
    name: 'student-tools-kit-trace',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.TRACES },
  },
  StudentTraceView
)

testRoute(
  studentToolsKitUpdateTraceRoute,
  {
    path: 'tools/kit/update-trace/:id',
    name: 'student-tools-kit-update-trace',
    meta: { breadcrumb: BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.TRACES },
  },
  StudentUpdateTraceView
)
