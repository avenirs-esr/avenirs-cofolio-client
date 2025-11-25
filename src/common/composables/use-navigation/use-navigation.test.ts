import { useNavigation } from '@/common/composables/use-navigation/use-navigation'
import { ROUTE_NAMES } from '@/common/constants'

import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn().mockImplementation((args) => {
      pushMock(args)
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
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.DELIVERABLES)
    })
  })

  BddTest().when('trying to navigate to student home', () => {
    BddTest().then('it should navigate to student home', () => {
      const { navigateToStudentHome } = navigation
      navigateToStudentHome()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.HOME)
    })
  })

  BddTest().when('trying to navigate to student events', () => {
    BddTest().then('it should navigate to student events', () => {
      const { navigateToStudentEvents } = navigation
      navigateToStudentEvents()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.EVENTS)
    })
  })

  BddTest().when('trying to navigate to student mailbox', () => {
    BddTest().then('it should navigate to student mailbox', () => {
      const { navigateToStudentMailbox } = navigation
      navigateToStudentMailbox()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.MAILBOX)
    })
  })

  BddTest().when('trying to navigate to student notifications', () => {
    BddTest().then('it should navigate to student notifications', () => {
      const { navigateToStudentNotifications } = navigation
      navigateToStudentNotifications()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.NOTIFICATIONS)
    })
  })

  BddTest().when('trying to navigate to student pages', () => {
    BddTest().then('it should navigate to student pages', () => {
      const { navigateToStudentPages } = navigation
      navigateToStudentPages()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.TOOLS_PAGES)
    })
  })

  BddTest().when('trying to navigate to student resumes', () => {
    BddTest().then('it should navigate to student resumes', () => {
      const { navigateToStudentResumes } = navigation
      navigateToStudentResumes()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.TOOLS_RESUMES)
    })
  })

  BddTest().when('trying to navigate to self-knowledge categories', () => {
    BddTest().then('it should navigate to self-knowledge categories', () => {
      const { navigateToStudentSelfKnowledgeCategory } = navigation
      navigateToStudentSelfKnowledgeCategory()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.SELFKNOWLEDGE_CATEGORY)
    })
  })

  BddTest().when('trying to navigate to self-knowledge elements update', () => {
    BddTest().then('it should navigate to self-knowledge elements update', () => {
      const { navigateToStudentSelfKnowledgeElementUpdate } = navigation
      navigateToStudentSelfKnowledgeElementUpdate({ categoryId: 'categoryId', elementId: 'elementId' })
      expect(pushMock).toHaveBeenCalledWith({
        name: ROUTE_NAMES.STUDENT.SELFKNOWLEDGE_ELEMENT_UPDATE.name,
        params: { path: ROUTE_NAMES.STUDENT.SELFKNOWLEDGE_ELEMENT_UPDATE.path, categoryId: 'categoryId', elementId: 'elementId' }
      })
    })
  })

  BddTest().when('trying to navigate to student skills', () => {
    BddTest().then('it should navigate to student skills', () => {
      const { navigateToStudentSkills } = navigation
      navigateToStudentSkills()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.EDUCATION_SKILLS)
    })
  })

  BddTest().when('trying to navigate to student traces', () => {
    BddTest().then('it should navigate to student traces', () => {
      const { navigateToStudentTraces } = navigation
      navigateToStudentTraces()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.TOOLS_TRACES)
    })
  })

  BddTest().when('trying to navigate to student update additional skill', () => {
    BddTest().then('it should navigate to student update additional skill', () => {
      const { navigateToStudentUpdateAdditionalSkill } = navigation
      navigateToStudentUpdateAdditionalSkill()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.STUDENT.UPDATE_ADDITIONAL_SKILL)
    })
  })

  BddTest().when('trying to navigate to teacher home', () => {
    BddTest().then('it should navigate to teacher home', () => {
      const { navigateToTeacherHome } = navigation
      navigateToTeacherHome()
      expect(pushMock).toHaveBeenCalledWith(ROUTE_NAMES.TEACHER.HOME)
    })
  })
})
