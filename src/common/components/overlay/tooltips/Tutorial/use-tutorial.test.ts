import { useTutorial } from '@/common/components/overlay/tooltips/Tutorial/use-tutorial'
import { ROUTES } from '@/common/constants'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const route = reactive<{ name: string }>({
  name: ROUTES.STAFF.HOME.name,
})

const navigateToStaffHome = vi.fn()
const navigateToStudentHome = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => route,
}))

vi.mock('@/common/composables/use-navigation/use-navigation', () => ({
  useNavigation: () => ({
    navigateToStaffHome,
    navigateToStudentHome,
  }),
}))

const mountUseTutorial = () => mountComposable(() => useTutorial(), {})

BddTest().given('a useTutorial composable', () => {
  beforeEach(() => {
    route.name = ROUTES.STAFF.HOME.name

    localStorage.clear()
    navigateToStaffHome.mockClear()
    navigateToStudentHome.mockClear()
  })

  BddTest().when('the current route is a staff route', () => {
    beforeEach(() => {
      route.name = ROUTES.STAFF.HOME.name
    })

    BddTest().then('it should mark the staff tutorial as seen', () => {
      const { result } = mountUseTutorial()

      result.markTutorialAsSeen()

      expect(localStorage.getItem('staff-tutorial-seen')).toBe('true')
    })

    BddTest().then('it should return whether the staff tutorial has been seen', () => {
      localStorage.setItem('staff-tutorial-seen', JSON.stringify(true))

      const { result } = mountUseTutorial()

      expect(result.hasSeenTutorial()).toBe(true)
    })

    BddTest().then('it should return false when the staff tutorial has not been seen', () => {
      const { result } = mountUseTutorial()

      expect(result.hasSeenTutorial()).toBe(false)
    })

    BddTest().when('the tutorial is replayed from the staff home', () => {
      BddTest().then('it should reset the seen state and request a replay', () => {
        const { result } = mountUseTutorial()

        result.replayTutorial()

        expect(localStorage.getItem('staff-tutorial-seen')).toBe('false')
        expect(result.replayRequested.value).toBe(true)
        expect(navigateToStaffHome).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the tutorial is replayed from another staff route', () => {
      beforeEach(() => {
        route.name = ROUTES.STAFF.ACCESSIBILITY.name
      })

      BddTest().then('it should reset the seen state and navigate to the staff home', () => {
        const { result } = mountUseTutorial()

        result.replayTutorial()

        expect(localStorage.getItem('staff-tutorial-seen')).toBe('false')
        expect(navigateToStaffHome).toHaveBeenCalled()
        expect(navigateToStudentHome).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the current route is a student route', () => {
    beforeEach(() => {
      route.name = ROUTES.STUDENT.HOME.name
    })

    BddTest().then('it should mark the student tutorial as seen', () => {
      const { result } = mountUseTutorial()

      result.markTutorialAsSeen()

      expect(localStorage.getItem('student-tutorial-seen')).toBe('true')
    })

    BddTest().then('it should return whether the student tutorial has been seen', () => {
      localStorage.setItem('student-tutorial-seen', JSON.stringify(true))

      const { result } = mountUseTutorial()

      expect(result.hasSeenTutorial()).toBe(true)
    })

    BddTest().when('the tutorial is replayed from the student home', () => {
      BddTest().then('it should reset the seen state and request a replay', () => {
        const { result } = mountUseTutorial()

        result.replayTutorial()

        expect(localStorage.getItem('student-tutorial-seen')).toBe('false')
        expect(result.replayRequested.value).toBe(true)
        expect(navigateToStudentHome).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the tutorial is replayed from another student route', () => {
      beforeEach(() => {
        route.name = ROUTES.STUDENT.ACCESSIBILITY.name
      })

      BddTest().then('it should reset the seen state and navigate to the student home', () => {
        const { result } = mountUseTutorial()

        result.replayTutorial()

        expect(localStorage.getItem('student-tutorial-seen')).toBe('false')
        expect(navigateToStudentHome).toHaveBeenCalled()
        expect(navigateToStaffHome).not.toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the tutorial has never been seen', () => {
    BddTest().then('it should return false', () => {
      const { result } = mountUseTutorial()

      expect(result.hasSeenTutorial()).toBe(false)
    })
  })

  BddTest().when('the tutorial has been marked as seen', () => {
    BddTest().then('it should return true', () => {
      const { result } = mountUseTutorial()

      result.markTutorialAsSeen()

      expect(result.hasSeenTutorial()).toBe(true)
    })
  })
})
