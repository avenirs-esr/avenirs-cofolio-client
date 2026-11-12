import type { VueWrapper } from '@vue/test-utils'
import type { ActivityCreationModalProps } from '@/features/staff/activities/components/modals/ActivityCreationModal/ActivityCreationModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ConfirmationModalStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { mockedActivityDraftCreationResponse } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { createActivityDraftErrorHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { ActivityTitleInputStub } from '@/features/staff/activities/components/interactions/inputs/ActivityTitleInput/ActivityTitleInput.stub'
import ActivityCreationModal from '@/features/staff/activities/components/modals/ActivityCreationModal/ActivityCreationModal.vue'

const ACTIVITY_ERROR_TITLE = 'Une erreur est survenue lors de la création de l\'activité'
const ACTIVITY_MODAL_TITLE = 'Créer une activité'
const INVALID_FORM_TOOLTIP = 'Le formulaire n\'est pas valide'
const SUB_ACTIVITY_ERROR_TITLE = 'Une erreur est survenue lors de la création de la sous-activité'
const SUB_ACTIVITY_MODAL_TITLE = 'Créer une sous-activité'

const defaultProps: ActivityCreationModalProps = {
  opened: true
}

const {
  mockAddErrorMessage,
  mockNavigateToEditNationalActivity,
} = vi.hoisted(() => ({
  mockAddErrorMessage: vi.fn(),
  mockNavigateToEditNationalActivity: vi.fn(),
}))

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStaffActivitiesEditNationalActivity: mockNavigateToEditNationalActivity,
    }),
  }
})

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

BddTest().given('an ActivityCreationModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityCreationModal>>

  const stubs = {
    ActivityTitleInput: ActivityTitleInputStub,
    ConfirmationModal: ConfirmationModalStub,
  }

  const mountWith = (props: Partial<ActivityCreationModalProps> = {}) => {
    wrapper = mountComponent(ActivityCreationModal, {
      props: {
        ...defaultProps,
        ...props
      },
      global: { stubs }
    })
  }

  const getModal = () => wrapper.findComponent(ConfirmationModalStub) as VueWrapper<InstanceType<typeof ConfirmationModalStub>>
  const getModalTitle = () => wrapper.find('[data-testid="activity-creation-modal-title"]')
  const getTitleInput = () => wrapper.findComponent(ActivityTitleInputStub) as VueWrapper<InstanceType<typeof ActivityTitleInputStub>>

  const getCloseEvents = () => wrapper.emitted('close')

  const typeValidTitle = async () => {
    getTitleInput().vm.$emit('update:modelValue', 'Mon activité')
    await wrapper.vm.$nextTick()
  }

  const confirmModal = async () => {
    getModal().vm.$emit('confirm')
    await wrapper.vm.$nextTick()
  }

  const closeModal = async () => {
    getModal().vm.$emit('close')
    await wrapper.vm.$nextTick()
  }

  const expectConfirmButtonEnabled = async (expected = true) => {
    await vi.waitFor(() => expect(getModal().props('confirmButtonDisabled')).toBe(!expected))
  }

  const expectClosed = async () => {
    await vi.waitFor(() => expect(getCloseEvents()).toHaveLength(1))
  }

  const expectErrorMessage = async (title: string) => {
    await vi.waitFor(() => {
      expect(mockAddErrorMessage).toHaveBeenCalledTimes(1)
      expect(mockAddErrorMessage).toHaveBeenCalledWith(expect.objectContaining({ title }))
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render an opened modal with the confirm button disabled', () => {
      expect(getModal().props()).toMatchObject({
        opened: true,
        confirmButtonDisabled: true,
        confirmButtonDisabledTooltip: INVALID_FORM_TOOLTIP,
      })
    })

    BddTest().then('it should render the activity creation title', () => {
      expect(getModalTitle().text()).toBe(ACTIVITY_MODAL_TITLE)
    })

    BddTest().then('it should render the title input', () => {
      expect(getTitleInput().exists()).toBe(true)
    })

    BddTest().then('it should not flag the title input as a sub-activity', () => {
      expect(getTitleInput().props('isSubActivity')).toBe(false)
    })
  })

  BddTest().when('the component is mounted closed', () => {
    beforeEach(() => {
      mountWith({
        opened: false
      })
    })

    BddTest().then('it should render a closed modal', () => {
      expect(getModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a parent activity draft id', () => {
    beforeEach(() => {
      mountWith({
        activityDraftId: 'parent-activity-draft-id'
      })
    })

    BddTest().then('it should render the sub-activity creation title', () => {
      expect(getModalTitle().text()).toBe(SUB_ACTIVITY_MODAL_TITLE)
    })

    BddTest().then('it should flag the title input as a sub-activity', () => {
      expect(getTitleInput().props('isSubActivity')).toBe(true)
    })
  })

  BddTest().when('a valid title is typed', () => {
    beforeEach(async () => {
      mountWith()
      await typeValidTitle()
    })

    BddTest().then('it should enable the confirm button', async () => {
      await expectConfirmButtonEnabled()
    })
  })

  BddTest().when('the modal is closed after a valid title was typed', () => {
    beforeEach(async () => {
      mountWith()
      await typeValidTitle()
      await expectConfirmButtonEnabled()
      await closeModal()
    })

    BddTest().then('it should emit close', async () => {
      await expectClosed()
    })

    BddTest().then('it should reset the form', async () => {
      await expectConfirmButtonEnabled(false)
    })
  })

  BddTest().when('a valid title is confirmed and the activity creation succeeds', () => {
    beforeEach(async () => {
      mountWith()
      await typeValidTitle()
      await confirmModal()
    })

    BddTest().then('it should emit close', async () => {
      await expectClosed()
    })

    BddTest().then('it should not display any error', async () => {
      await expectClosed()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should navigate to the edit page of the created draft', async () => {
      await vi.waitFor(() => expect(mockNavigateToEditNationalActivity).toHaveBeenCalledWith({
        id: mockedActivityDraftCreationResponse.draftId,
        mode: 'add',
      }))
    })
  })

  BddTest().when('a valid title is confirmed and the activity creation fails', () => {
    beforeEach(async () => {
      server.use(createActivityDraftErrorHandler)
      mountWith()
      await typeValidTitle()
      await confirmModal()
    })

    BddTest().then('it should display the activity creation error', async () => {
      await expectErrorMessage(ACTIVITY_ERROR_TITLE)
    })

    BddTest().then('it should keep the modal open', async () => {
      await expectErrorMessage(ACTIVITY_ERROR_TITLE)
      expect(getCloseEvents()).toBeUndefined()
    })
  })

  BddTest().when('a valid title is confirmed and the sub-activity creation succeeds', () => {
    beforeEach(async () => {
      mountWith({
        activityDraftId: 'parent-activity-draft-id'
      })
      await typeValidTitle()
      await confirmModal()
    })

    BddTest().then('it should emit close', async () => {
      await expectClosed()
    })

    BddTest().then('it should not display any error', async () => {
      await expectClosed()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should not navigate', async () => {
      await expectClosed()
      expect(mockNavigateToEditNationalActivity).not.toHaveBeenCalled()
    })

    BddTest().then('it should reset the form', async () => {
      await expectClosed()
      await expectConfirmButtonEnabled(false)
    })
  })

  BddTest().when('a valid title is confirmed and the sub-activity creation fails', () => {
    beforeEach(async () => {
      mountWith({
        activityDraftId: 'INVALID_ACTIVITY_ID'
      })
      await typeValidTitle()
      await confirmModal()
    })

    BddTest().then('it should display the sub-activity creation error', async () => {
      await expectErrorMessage(SUB_ACTIVITY_ERROR_TITLE)
    })

    BddTest().then('it should keep the modal open', async () => {
      await expectErrorMessage(SUB_ACTIVITY_ERROR_TITLE)
      expect(getCloseEvents()).toBeUndefined()
    })
  })
})
