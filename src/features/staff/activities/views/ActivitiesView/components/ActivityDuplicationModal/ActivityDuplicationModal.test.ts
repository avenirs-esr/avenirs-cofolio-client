import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityDraftCreationResponse } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { EActivityStatus } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { ActivityTitleInputStub } from '@/features/staff/activities/components/interactions/inputs/ActivityTitleInput/ActivityTitleInput.stub'
import ActivityDuplicationModal, { type ActivityDuplicationModalProps } from '@/features/staff/activities/views/ActivitiesView/components/ActivityDuplicationModal/ActivityDuplicationModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockNavigateToCatalog = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()

  return {
    ...actual,
    useNavigation: () => ({
      navigateToStaffActivityCatalog: mockNavigateToCatalog,
    }),
  }
})

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')

  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    })),
  }
})

BddTest().given('an ActivityDuplicationModal', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDuplicationModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
    ActivityTitleInput: ActivityTitleInputStub,
  }

  const mountWith = (props: Partial<ActivityDuplicationModalProps> = {}) => {
    vi.clearAllMocks()

    wrapper = mountComponent(ActivityDuplicationModal, {
      props: {
        opened: true,
        activityId: 'activity-id',
        activityTitle: 'Mon activité',
        ...props,
      },
      global: { stubs },
    })
  }

  const getModal = () =>
    wrapper.findComponent(ConfirmationModalStub) as VueWrapper<InstanceType<typeof ConfirmationModalStub>>

  const getModalTitle = () =>
    wrapper.find('[data-testid="activity-duplication-modal-title"]')

  const getTitleInput = () =>
    wrapper.findComponent(ActivityTitleInputStub) as VueWrapper<InstanceType<typeof ActivityTitleInputStub>>

  const fillValidTitle = async () => {
    await getTitleInput().vm.$emit('update:modelValue', 'Copie de mon activité')
  }

  BddTest().when('the modal is mounted with opened=true', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the ConfirmationModal with correct props and content', () => {
      const modal = getModal()

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(true)
      expect(modal.props('confirmButtonDisabled')).toBe(true)
      expect(modal.props('isLoading')).toBe(false)
      expect(getModalTitle().text()).toBe('Dupliquer une activité')
      expect(getTitleInput().exists()).toBe(true)
    })
  })

  BddTest().when('mounted with opened=false', () => {
    beforeEach(() => {
      mountWith({ opened: false })
    })

    BddTest().then('it should pass opened=false to ConfirmationModal', () => {
      expect(getModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the title input is filled with a valid value', () => {
    beforeEach(async () => {
      mountWith()
      await fillValidTitle()
    })

    BddTest().then('it should enable the confirm button', async () => {
      await vi.waitFor(() =>
        expect(getModal().props('confirmButtonDisabled')).toBe(false)
      )
    })
  })

  BddTest().when('the close button is clicked', () => {
    beforeEach(async () => {
      mountWith()
      await getModal().vm.$emit('close')
    })

    BddTest().then('it should emit the close event', () => {
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    BddTest().then('it should not emit the duplicated event', () => {
      expect(wrapper.emitted('duplicated')).toBeFalsy()
    })
  })

  BddTest().when('the form is submitted with a valid title and the duplication succeeds', () => {
    beforeEach(async () => {
      mountWith()
      await fillValidTitle()
      await getModal().vm.$emit('confirm')
    })

    BddTest().then('it should emit the duplicated event', async () => {
      await vi.waitFor(() => expect(wrapper.emitted('duplicated')).toBeTruthy())
    })

    BddTest().then('it should not emit the close event', async () => {
      await vi.waitFor(() => expect(wrapper.emitted('duplicated')).toBeTruthy())
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    BddTest().then('it should call addSuccessMessage', async () => {
      await vi.waitFor(() =>
        expect(mockAddSuccessMessage).toHaveBeenCalledWith(
          'L\'activité a été dupliquée avec succès'
        )
      )
    })

    BddTest().then('it should navigate to the catalog with the draft id and DRAFT status', async () => {
      await vi.waitFor(() => {
        expect(mockNavigateToCatalog).toHaveBeenCalledWith({
          id: mockedActivityDraftCreationResponse.draftId,
          status: EActivityStatus.DRAFT,
        })
      })
    })
  })

  BddTest().when('the form is submitted with a valid title and the duplication fails', () => {
    beforeEach(async () => {
      mountWith({ activityId: 'INVALID_ACTIVITY_ID' })
      await fillValidTitle()
      await getModal().vm.$emit('confirm')
    })

    BddTest().then('it should call addErrorMessage', async () => {
      await vi.waitFor(() =>
        expect(mockAddErrorMessage).toHaveBeenCalledTimes(1)
      )
    })

    BddTest().then('it should call addErrorMessage with the correct error title', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Une erreur est survenue lors de la duplication de l\'activité',
          })
        )
      })
    })

    BddTest().then('it should not emit the duplicated event', async () => {
      await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalled())
      expect(wrapper.emitted('duplicated')).toBeFalsy()
    })
  })
})
