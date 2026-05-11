import { EActivityThematic } from '@/api/avenir-esr'
import { useNavigation } from '@/common/composables/use-navigation/use-navigation'
import { ROUTES } from '@/common/constants'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const pushMock = vi.fn()
const replaceMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn().mockImplementation((args) => {
      pushMock(args)
    }),
    replace: vi.fn().mockImplementation((args) => {
      replaceMock(args)
    }),
  }),
}))

BddTest().given('a useNavigation composable', () => {
  let navigation: ReturnType<typeof useNavigation>

  beforeEach(() => {
    pushMock.mockClear()
    vi.clearAllMocks()

    const { result } = mountComposable(useNavigation, {})
    navigation = result
  })

  BddTest().when('trying to navigate to student deliverables', () => {
    BddTest().then('it should navigate to student delivarables', () => {
      const { navigateToStudentDeliverables } = navigation
      navigateToStudentDeliverables()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.DELIVERABLES)
    })
  })

  BddTest().when('trying to navigate to student home', () => {
    BddTest().then('it should navigate to student home', () => {
      const { navigateToStudentHome } = navigation
      navigateToStudentHome()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('trying to navigate to student events', () => {
    BddTest().then('it should navigate to student events', () => {
      const { navigateToStudentEvents } = navigation
      navigateToStudentEvents()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.EVENTS)
    })
  })

  BddTest().when('trying to navigate to student mailbox', () => {
    BddTest().then('it should navigate to student mailbox', () => {
      const { navigateToStudentMailbox } = navigation
      navigateToStudentMailbox()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.MAILBOX)
    })
  })

  BddTest().when('trying to navigate to student notifications', () => {
    BddTest().then('it should navigate to student notifications', () => {
      const { navigateToStudentNotifications } = navigation
      navigateToStudentNotifications()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.NOTIFICATIONS)
    })
  })

  BddTest().when('trying to navigate to student pages', () => {
    BddTest().then('it should navigate to student pages', () => {
      const { navigateToStudentPages } = navigation
      navigateToStudentPages()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.TOOLS_PAGES)
    })
  })

  BddTest().when('trying to navigate to student resumes', () => {
    BddTest().then('it should navigate to student resumes', () => {
      const { navigateToStudentResumes } = navigation
      navigateToStudentResumes()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.TOOLS_RESUMES)
    })
  })

  BddTest().when('trying to navigate to student trajectories', () => {
    BddTest().then('it should navigate to student trajectories', () => {
      const { navigateToStudentTrajectories } = navigation
      navigateToStudentTrajectories()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.PROJECT_TRAJECTORIES)
    })
  })

  BddTest().when('trying to navigate to student trajectories with replace', () => {
    BddTest().then('it should navigate to student trajectories with replace', () => {
      const { navigateToStudentTrajectories } = navigation
      navigateToStudentTrajectories(true)
      expect(replaceMock).toHaveBeenCalledWith(ROUTES.STUDENT.PROJECT_TRAJECTORIES)
    })
  })

  BddTest().when('trying to navigate to self-knowledge categories', () => {
    BddTest().then('it should navigate to self-knowledge categories', () => {
      const { navigateToStudentSelfKnowledgeCategory } = navigation
      navigateToStudentSelfKnowledgeCategory({ categoryId: 'categoryId', elementId: 'elementId' })
      expect(pushMock).toHaveBeenCalledWith({
        name: ROUTES.STUDENT.SELFKNOWLEDGE_CATEGORY.name,
        params: { id: 'categoryId' },
        query: { elementId: 'elementId' }
      })
    })
  })

  BddTest().when('trying to navigate to self-knowledge elements update', () => {
    BddTest().then('it should navigate to self-knowledge elements update', () => {
      const { navigateToStudentSelfKnowledgeElementUpdate } = navigation
      navigateToStudentSelfKnowledgeElementUpdate({ categoryId: 'categoryId', elementId: 'elementId' })
      expect(pushMock).toHaveBeenCalledWith({
        name: ROUTES.STUDENT.SELFKNOWLEDGE_ELEMENT_UPDATE.name,
        params: { categoryId: 'categoryId', elementId: 'elementId' }
      })
    })
  })

  BddTest().when('trying to navigate to self-knowledge elements update with replace', () => {
    BddTest().then('it should navigate to self-knowledge elements update with replace', () => {
      const { navigateToStudentSelfKnowledgeElementUpdate } = navigation
      navigateToStudentSelfKnowledgeElementUpdate({ categoryId: 'categoryId', elementId: 'elementId', replace: true })
      expect(replaceMock).toHaveBeenCalledWith({
        name: ROUTES.STUDENT.SELFKNOWLEDGE_ELEMENT_UPDATE.name,
        params: { categoryId: 'categoryId', elementId: 'elementId' }
      })
    })
  })

  BddTest().when('trying to navigate to student skills', () => {
    BddTest().then('it should navigate to student skills', () => {
      const { navigateToStudentSkills } = navigation
      navigateToStudentSkills()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.EDUCATION_SKILLS)
    })
  })

  BddTest().when('trying to navigate to student project skills', () => {
    BddTest().then('it should navigate to student project skills', () => {
      const { navigateToStudentProjectSkills } = navigation
      navigateToStudentProjectSkills({})
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.PROJECT_SKILLS)
    })
  })

  BddTest().when('trying to navigate to student project skills with replace', () => {
    BddTest().then('it should navigate to student project skills with replace', () => {
      const { navigateToStudentProjectSkills } = navigation
      navigateToStudentProjectSkills({ replace: true })
      expect(replaceMock).toHaveBeenCalledWith(ROUTES.STUDENT.PROJECT_SKILLS)
    })
  })

  BddTest().when('trying to navigate to student project activities catalog without parameters', () => {
    BddTest().then('it should navigate to student project activities catalog', () => {
      const { navigateToStudentProjectActivitiesCatalog } = navigation
      navigateToStudentProjectActivitiesCatalog()
      expect(pushMock).toHaveBeenCalledWith({
        name: ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG.name,
        params: {
          id: undefined,
          thematic: undefined
        }
      })
    })
  })

  BddTest().when('trying to navigate to student project activities', () => {
    BddTest().then('it should navigate to student project activities', () => {
      const { navigateToStudentProjectActivities } = navigation
      navigateToStudentProjectActivities({})
      expect(pushMock).toHaveBeenCalledWith({ name: ROUTES.STUDENT.PROJECT_ACTIVITIES.name })
    })
  })

  BddTest().when('trying to navigate to student project activities with replace', () => {
    BddTest().then('it should navigate to student project activities with replace', () => {
      const { navigateToStudentProjectActivities } = navigation
      navigateToStudentProjectActivities({ replace: true })
      expect(replaceMock).toHaveBeenCalledWith({ name: ROUTES.STUDENT.PROJECT_ACTIVITIES.name })
    })
  })

  BddTest().when('trying to navigate to student project activities catalog with thematic and id', () => {
    BddTest().then('it should navigate to student project activities catalog with thematic and id', () => {
      const { navigateToStudentProjectActivitiesCatalog } = navigation
      navigateToStudentProjectActivitiesCatalog({ thematic: EActivityThematic.RESUMES, id: 'some-id' })
      expect(pushMock).toHaveBeenCalledWith({
        name: ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG.name,
        params: {
          id: 'some-id',
          thematic: EActivityThematic.RESUMES
        }
      })
    })
  })

  BddTest().when('trying to navigate to student project activities catalog with replace', () => {
    BddTest().then('it should navigate to student project activities catalog with replace', () => {
      const { navigateToStudentProjectActivitiesCatalog } = navigation
      navigateToStudentProjectActivitiesCatalog({ replace: true })
      expect(replaceMock).toHaveBeenCalledWith({
        name: ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG.name,
        params: {
          id: undefined,
          thematic: undefined
        }
      })
    })
  })

  BddTest().when('trying to navigate to student traces', () => {
    BddTest().then('it should navigate to student traces', () => {
      const { navigateToStudentTraces } = navigation
      navigateToStudentTraces()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.TOOLS_TRACES)
    })
  })

  BddTest().when('trying to navigate to student traces with replace', () => {
    BddTest().then('it should navigate to student traces with replace', () => {
      const { navigateToStudentTraces } = navigation
      navigateToStudentTraces({ replace: true })
      expect(replaceMock).toHaveBeenCalledWith(ROUTES.STUDENT.TOOLS_TRACES)
    })
  })

  BddTest().when('trying to navigate to student declared programs', () => {
    BddTest().then('it should navigate to student declared programs', () => {
      const { navigateToStudentDeclaredPrograms } = navigation
      navigateToStudentDeclaredPrograms({})
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS)
    })
  })

  BddTest().when('trying to navigate to student declared programs with replace', () => {
    BddTest().then('it should navigate to student declared programs with replace', () => {
      const { navigateToStudentDeclaredPrograms } = navigation
      navigateToStudentDeclaredPrograms({ replace: true })
      expect(replaceMock).toHaveBeenCalledWith(ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS)
    })
  })

  BddTest().when('trying to navigate to student update declared skill', () => {
    BddTest().then('it should navigate to student update declared skill', () => {
      const { navigateToStudentUpdateDeclaredSkill } = navigation
      navigateToStudentUpdateDeclaredSkill()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.UPDATE_DECLARED_SKILL)
    })
  })

  BddTest().when('trying to navigate to student update declared program', () => {
    BddTest().then('it should navigate to student update declared program', () => {
      const { navigateToStudentUpdateDeclaredProgram } = navigation
      navigateToStudentUpdateDeclaredProgram()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.PERSONAL_CAREER_UPDATE_DECLARED_PROGRAM)
    })
  })

  BddTest().when('trying to navigate to staff home', () => {
    BddTest().then('it should navigate to staff home', () => {
      const { navigateToStaffHome } = navigation
      navigateToStaffHome()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STAFF.HOME)
    })
  })

  BddTest().when('trying to navigate to student declared experience', () => {
    BddTest().then('it should navigate to student declared experience', () => {
      const { navigateToStudentDeclaredExperience } = navigation
      navigateToStudentDeclaredExperience({ id: 'exp-123' })
      expect(pushMock).toHaveBeenCalledWith({
        name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
        params: { id: 'exp-123' }
      })
    })
  })

  BddTest().when('trying to navigate to student declared experience with replace', () => {
    BddTest().then('it should navigate to student declared experience with replace', () => {
      const { navigateToStudentDeclaredExperience } = navigation
      navigateToStudentDeclaredExperience({ id: 'exp-123', replace: true })
      expect(replaceMock).toHaveBeenCalledWith({
        name: ROUTES.STUDENT.DECLARED_EXPERIENCE.name,
        params: { id: 'exp-123' }
      })
    })
  })

  BddTest().when('trying to navigate to student update declared experience', () => {
    BddTest().then('it should navigate to student update declared experience', () => {
      const { navigateToStudentUpdateDeclaredExperience } = navigation
      navigateToStudentUpdateDeclaredExperience({})
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE)
    })
  })

  BddTest().when('trying to navigate to student update declared experience with replace', () => {
    BddTest().then('it should navigate to student update declared experience with replace', () => {
      const { navigateToStudentUpdateDeclaredExperience } = navigation
      navigateToStudentUpdateDeclaredExperience({ replace: true })
      expect(replaceMock).toHaveBeenCalledWith(ROUTES.STUDENT.UPDATE_DECLARED_EXPERIENCE)
    })
  })

  BddTest().when('trying to navigate to student declared skill', () => {
    BddTest().then('it should navigate to student declared skill', () => {
      const { navigateToStudentDeclaredSkill } = navigation
      navigateToStudentDeclaredSkill()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STUDENT.DECLARED_SKILL)
    })
  })

  BddTest().when('trying to navigate to activity detailed', () => {
    BddTest().then('it should navigate to activity detailed with id and thematic', () => {
      const { navigateToActivityDetailed } = navigation
      navigateToActivityDetailed({ id: 'act-123', thematic: 'SELF_KNOWLEDGE' })

      expect(pushMock).toHaveBeenCalledWith({
        name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
        params: { id: 'act-123', thematic: 'SELF_KNOWLEDGE' },
      })
    })
  })

  BddTest().when('trying to navigate to activity detailed without parameters', () => {
    BddTest().then('it should navigate to activity detailed with undefined params', () => {
      const { navigateToActivityDetailed } = navigation
      navigateToActivityDetailed({})

      expect(pushMock).toHaveBeenCalledWith({
        name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
        params: { id: undefined, thematic: undefined },
      })
    })
  })

  BddTest().when('trying to navigate to staff activities', () => {
    BddTest().then('it should navigate to staff activities', () => {
      const { navigateToStaffActivities } = navigation
      navigateToStaffActivities()
      expect(pushMock).toHaveBeenCalledWith(ROUTES.STAFF.ACTIVITIES)
    })
  })

  BddTest().when('trying to navigate to staff activities edit national activity', () => {
    BddTest().then('it should navigate to staff activities edit national activity', () => {
      const { navigateToStaffActivitiesEditNationalActivity } = navigation
      navigateToStaffActivitiesEditNationalActivity({ id: 'id' })

      expect(pushMock).toHaveBeenCalledWith({
        name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name,
        params: { id: 'id' }
      })
    })
  })

  BddTest().when('trying to navigate to staff activities edit national activity with replace', () => {
    BddTest().then('it should navigate to staff activities edit national activity with replace', () => {
      const { navigateToStaffActivitiesEditNationalActivity } = navigation
      navigateToStaffActivitiesEditNationalActivity({ id: 'id', replace: true })

      expect(replaceMock).toHaveBeenCalledWith({
        name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name,
        params: { id: 'id' }
      })
    })
  })
})
