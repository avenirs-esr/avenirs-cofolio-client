import type { AvRoute } from '@/common/types'
import {
  declaredExperienceRoute,
  declaredProgramRoute,
  personalCareerRoute,
} from '@/features/student/personalCareer/routes'
import DeclaredExperienceView
  from '@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'
import DeclaredProgramDetailedView
  from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'
import PersonalCareerView
  from '@/features/student/personalCareer/views/PersonalCareerView/PersonalCareerView.vue'
import ActivitiesSection
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ActivitiesSection/ActivitiesSection.vue'
import ExperiencesSection
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/ExperiencesSection.vue'
import MyCareerSection
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/MyCareerSection/MyCareerSection.vue'
import ProgramsSection
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/ProgramsSection.vue'
import { testRoute } from 'tests/utils'

testRoute(
  personalCareerRoute,
  {
    path: 'projects/personal-career',
    name: 'student-project-personal-career',
    redirect: { name: 'personal-career-my-career' },
  },
  PersonalCareerView
)

const children = personalCareerRoute.children as AvRoute[]

testRoute(
  children[0],
  {
    path: 'my-career',
    name: 'personal-career-my-career',
  },
  MyCareerSection
)

testRoute(
  children[1],
  {
    path: 'declared-programs',
    name: 'personal-career-declared-programs',
  },
  ProgramsSection
)

testRoute(
  children[2],
  {
    path: 'activities',
    name: 'personal-career-activities',
  },
  ActivitiesSection
)

testRoute(
  children[3],
  {
    path: 'experiences',
    name: 'personal-career-experiences',
  },
  ExperiencesSection
)

testRoute(
  declaredProgramRoute,
  {
    path: 'projects/personal-career/declared-programs/:id',
    name: 'personal-career-declared-program-detailed',
  },
  DeclaredProgramDetailedView
)

testRoute(
  declaredExperienceRoute,
  {
    path: 'declared-experience/:id',
    name: 'student-declared-experience',
  },
  DeclaredExperienceView
)
