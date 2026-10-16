import type { VueWrapper } from '@vue/test-utils'
import type { UserProfileDropdownAction } from '@/common/components/overlay/UserProfileDropdown/UserProfileDropdown.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { ConfirmationModalStub } from '@/common/components/overlay/modals/ConfirmationModal/ConfirmationModal.stub'
import { UserProfileDropdownEvents } from '@/common/components/overlay/UserProfileDropdown/UserProfileDropdown.types'
import UserProfileDropdown from '@/common/components/overlay/UserProfileDropdown/UserProfileDropdown.vue'

const USERNAME = 'J. Moulin'
const REWATCH_TUTORIAL_LABEL = 'Revoir le tutoriel'
const LOGOUT_LABEL = 'Me déconnecter'

const EXTRA_ACTIONS: UserProfileDropdownAction[] = [
  { name: 'manage-profile', label: 'Gérer mon profil' },
  { name: 'see-calendar', label: 'Voir mon agenda' },
]

const { mockReplayTutorial, mockInvalidateSession, mockLocationAssign } = vi.hoisted(() => ({
  mockReplayTutorial: vi.fn(),
  mockInvalidateSession: vi.fn(),
  mockLocationAssign: vi.fn(),
}))

vi.mock('@/common/components/overlay/tooltips/Tutorial/use-tutorial', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/components/overlay/tooltips/Tutorial/use-tutorial')>()

  return {
    ...actual,
    useTutorial: () => ({
      replayTutorial: mockReplayTutorial,
    }),
  }
})

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({
    invalidateSession: mockInvalidateSession,
  }),
}))

BddTest().given('a user profile dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserProfileDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub,
    ConfirmationModal: ConfirmationModalStub,
  }

  const getDropdown = () => wrapper.findComponent(AvDropdownStub)
  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getEmittedActions = () => wrapper.emitted('actionSelected')

  const selectItem = async (itemName: string) => {
    getDropdown().vm.$emit('itemSelected', itemName)
    await nextTick()
  }

  const expectConfirmationModalToBeOpen = () => {
    expect(getConfirmationModal().props('opened')).toBe(true)
  }

  const expectConfirmationModalToBeClosed = () => {
    expect(getConfirmationModal().props('opened')).toBe(false)
  }

  const expectNoActionEmitted = () => {
    expect(getEmittedActions()).toBeUndefined()
  }

  const expectSessionKept = () => {
    expect(mockInvalidateSession).not.toHaveBeenCalled()
    expect(mockLocationAssign).not.toHaveBeenCalled()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('location', { ...window.location, assign: mockLocationAssign })

    wrapper = mount(UserProfileDropdown, {
      props: {
        username: USERNAME,
        actions: EXTRA_ACTIONS,
      },
      global: { stubs },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  BddTest().when('the dropdown is rendered', () => {
    BddTest().then('it should pass the username as dropdown trigger label', () => {
      expect(getDropdown().props('triggerLabel')).toBe(USERNAME)
    })

    BddTest().then('it should pass provided actions and logout and rewatch tutorial actions to the dropdown', () => {
      expect(getDropdown().props('items')).toEqual([
        ...EXTRA_ACTIONS.map(action => expect.objectContaining(action)),
        expect.objectContaining({ name: UserProfileDropdownEvents.REWATCH_TUTORIAL, icon: MDI_ICONS.REFRESH, label: REWATCH_TUTORIAL_LABEL }),
        expect.objectContaining({ name: UserProfileDropdownEvents.LOGOUT, icon: MDI_ICONS.LOGOUT, label: LOGOUT_LABEL }),
      ])
    })

    BddTest().then('it should not display the confirmation modal', () => {
      expectConfirmationModalToBeClosed()
    })
  })

  BddTest().when('an extra action is selected', () => {
    beforeEach(async () => {
      await selectItem(EXTRA_ACTIONS[0].name)
    })

    BddTest().then('it should emit the selected action name', () => {
      expect(getEmittedActions()).toEqual([[EXTRA_ACTIONS[0].name]])
    })
  })

  BddTest().when('the logout item is selected', () => {
    beforeEach(async () => {
      await selectItem(UserProfileDropdownEvents.LOGOUT)
    })

    BddTest().then('it should display the confirmation modal without emitting an action', () => {
      expectConfirmationModalToBeOpen()
      expectNoActionEmitted()
    })

    BddTest().then('it should not invalidate the session before the confirmation', () => {
      expectSessionKept()
    })
  })

  BddTest().when('the logout is confirmed', () => {
    beforeEach(async () => {
      await selectItem(UserProfileDropdownEvents.LOGOUT)
      getConfirmationModal().vm.$emit('confirm')
    })

    BddTest().then('it should invalidate the session', () => {
      expect(mockInvalidateSession).toHaveBeenCalledTimes(1)
    })

    BddTest().then('it should redirect to the logout url', () => {
      expect(mockLocationAssign).toHaveBeenCalledTimes(1)
      expect(mockLocationAssign).toHaveBeenCalledWith(__AUTH_LOGOUT_URL__)
    })
  })

  BddTest().when('the logout is canceled', () => {
    beforeEach(async () => {
      await selectItem(UserProfileDropdownEvents.LOGOUT)
      getConfirmationModal().vm.$emit('close')
      await nextTick()
    })

    BddTest().then('it should close the confirmation modal', () => {
      expectConfirmationModalToBeClosed()
    })

    BddTest().then('it should keep the session', () => {
      expectSessionKept()
    })
  })

  BddTest().when('the rewatch tutorial item is selected', () => {
    beforeEach(async () => {
      await selectItem(UserProfileDropdownEvents.REWATCH_TUTORIAL)
    })

    BddTest().then('it should call replayTutorial without emitting an action', () => {
      expect(mockReplayTutorial).toHaveBeenCalledTimes(1)
      expectNoActionEmitted()
    })
  })
})
