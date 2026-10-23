import { useNavigation } from '@/common/composables/use-navigation/use-navigation'
import { ROUTES } from '@/common/constants'

const replayRequested = ref(false)

export function useTutorial () {
  const route = useRoute()
  const { navigateToStaffHome, navigateToStudentHome } = useNavigation()

  const isStaff = computed(() => route.name?.toString().startsWith('staff'))
  const prefix = computed(() => isStaff.value ? 'staff' : 'student')

  function markTutorialAsSeen () {
    localStorage.setItem(`${prefix.value}-tutorial-seen`, JSON.stringify(true))
  }

  function hasSeenTutorial () {
    return JSON.parse(localStorage.getItem(`${prefix.value}-tutorial-seen`) || 'false')
  }

  function replayTutorial () {
    localStorage.setItem(`${prefix.value}-tutorial-seen`, JSON.stringify(false))

    const homeRouteName = isStaff.value ? ROUTES.STAFF.HOME.name : ROUTES.STUDENT.HOME.name
    if (route.name === homeRouteName) {
      replayRequested.value = true
      return
    }

    isStaff.value ? navigateToStaffHome() : navigateToStudentHome()
  }

  return {
    markTutorialAsSeen,
    hasSeenTutorial,
    replayTutorial,
    replayRequested
  }
}
