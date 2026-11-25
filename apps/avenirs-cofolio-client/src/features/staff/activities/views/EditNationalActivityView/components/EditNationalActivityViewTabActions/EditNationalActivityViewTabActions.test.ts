import type { ActivityPresentationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ConfirmationModalStub } from '@avenirs-esr/shared'
import { getAvButtonByTestId, mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'
import { mockedActivityDetail, mockedActivityPresentationWithUnpublishableSubActivities } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ROUTES } from '@/common/constants'
import EditNationalActivityViewTabActions from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.vue'
import {
  EditNationalActivityViewFormWrapper,
  EditNationalActivityViewFormWrapperValid,
  mockCanSave,
  mockIsBusy,
  mockIsSaving,
  mockSaveNow,
  resetMockSaveState,
} from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'

const REQUIRED_FIELDS_ERROR = 'Veuillez renseigner un titre, une thématique, une consigne, un extrait, un/des contexte(s) de réalisation conseillé(s) et au moins une cible pour publier l\'activité'
const REQUIRED_FIELDS_SUB_ACTIVITY_ERROR = 'Veuillez renseigner un titre, une consigne, un/des contexte(s) de réalisation conseillé(s) pour publier la sous-activité'
const UNPUBLISHABLE_SUB_ACTIVITIES_ERROR = 'Veuillez compléter les sous-activités pour publier l\'activité'
const PUBLISH_RIGHT_ONLY_TOOLTIP = 'Vous devez disposer du droit de publication sur l\'activité pour la publier'

const PARENT_ACTIVITY_ID = 'parent-activity-id'
const mockedSubActivityDetail: ActivityPresentationDTO = {
  ...mockedActivityDetail,
  id: 'sub-activity-1',
  mainActivityId: PARENT_ACTIVITY_ID,
}

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

vi.mock('@avenirs-esr/shared', async () => {
  const actual = await vi.importActual<typeof import('@avenirs-esr/shared')>('@avenirs-esr/shared')
  return {
    ...actual,
    useTaskLoading: () => ({
      isLoading: ref(false),
      withTaskLoading: async (task: () => Promise<unknown> | unknown) => await task(),
    }),
  }
})

type FormWrapperComponent
  = | typeof EditNationalActivityViewFormWrapper
    | typeof EditNationalActivityViewFormWrapperValid

interface MountOptions {
  FormWrapper?: FormWrapperComponent
  activity?: ActivityPresentationDTO
  nextStepConfig?: boolean
  hasPublishRight?: boolean
}

BddTest().given('an EditNationalActivityViewTabActions component', () => {
  let wrapper: ReturnType<typeof mountComponent>
  let actions: VueWrapper<InstanceType<typeof EditNationalActivityViewTabActions>>

  const stubs = {
    AvButton: AvButtonStub,
    AvMessage: AvMessageStub,
    ConfirmationModal: ConfirmationModalStub,
  }

  const mountActions = ({
    FormWrapper = EditNationalActivityViewFormWrapper,
    activity = mockedActivityDetail,
    nextStepConfig = false,
    hasPublishRight = true,
  }: MountOptions = {}) => {
    wrapper = mountComponent(FormWrapper, {
      slots: { default: h(EditNationalActivityViewTabActions, { activity, nextStepConfig, hasPublishRight }) },
      global: { stubs },
    })
    actions = wrapper.findComponent(EditNationalActivityViewTabActions)
  }

  const findByTestId = (testId: string) => actions.find(`[data-testid="${testId}"]`)
  const getExitButton = () => getAvButtonByTestId(actions, 'exit-button')
  const getSaveButton = () => getAvButtonByTestId(actions, 'save-button')
  const getPublishButton = () => getAvButtonByTestId(actions, 'publish-button')
  const getNextStepButton = () => getAvButtonByTestId(actions, 'activity-content-tab-next-step-button')
  const getConfirmationModal = () => actions.findComponent(ConfirmationModalStub)
  const getWarningMessage = () => actions.findComponent(AvMessageStub)

  const confirmPublication = async () => {
    await getPublishButton().trigger('click')
    await vi.waitFor(() => {
      expect(getConfirmationModal().props('opened')).toBe(true)
    })
    await getConfirmationModal().vm.$emit('confirm')
  }

  beforeEach(() => {
    vi.clearAllMocks()
    resetMockSaveState()
  })

  BddTest().when('there is nothing to save', () => {
    beforeEach(() => {
      mountActions()
    })

    BddTest().then('it should render the exit button', () => {
      expect(findByTestId('exit-button').exists()).toBe(true)
    })

    BddTest().then('the exit button should be a link to staff activities', () => {
      expect(getExitButton().props('to')).toBe(ROUTES.STAFF.ACTIVITIES)
    })

    BddTest().then('it should render the save button', () => {
      expect(findByTestId('save-button').exists()).toBe(true)
    })

    BddTest().then('the exit button should not be loading', () => {
      expect(getExitButton().props('isLoading')).toBe(false)
    })

    BddTest().then('the save button should be disabled', () => {
      expect(findByTestId('save-button').attributes()).toHaveProperty('disabled')
    })

    BddTest().then('the save button should explain why it is disabled', () => {
      expect(getSaveButton().props('disabledTooltip')).toBe('Modifiez un champ avant d\'enregistrer')
    })

    BddTest().then('it should render the publish button', () => {
      expect(findByTestId('publish-button').exists()).toBe(true)
    })

    BddTest().then('it should not render the next step button', () => {
      expect(findByTestId('activity-content-tab-next-step-button').exists()).toBe(false)
    })

    BddTest().then('it should not render the back to parent button', () => {
      expect(findByTestId('back-to-parent-button').exists()).toBe(false)
    })

    BddTest().then('it should render the publish ConfirmationModal closed', () => {
      expect(getConfirmationModal().exists()).toBe(true)
      expect(getConfirmationModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the view is busy', () => {
    beforeEach(() => {
      mockIsBusy.value = true
      mountActions()
    })

    BddTest().then('the exit button should be loading', () => {
      expect(getExitButton().props('isLoading')).toBe(true)
    })

    BddTest().then('the publish button should be loading', () => {
      expect(getPublishButton().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('changes can be saved', () => {
    beforeEach(() => {
      mockCanSave.value = true
      mountActions()
    })

    BddTest().then('the save button should be enabled', () => {
      expect(findByTestId('save-button').attributes()).not.toHaveProperty('disabled')
    })

    BddTest().and('the save button is clicked', () => {
      beforeEach(async () => {
        await findByTestId('save-button').trigger('click')
      })

      BddTest().then('it should save the changes right away', () => {
        expect(mockSaveNow).toHaveBeenCalledOnce()
      })
    })
  })

  BddTest().when('a save is in flight', () => {
    beforeEach(() => {
      mockIsSaving.value = true
      mountActions()
    })

    BddTest().then('the save button should be loading', () => {
      expect(getSaveButton().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('the save button is clicked while disabled', () => {
    beforeEach(async () => {
      mountActions()
      await findByTestId('save-button').trigger('click')
    })

    BddTest().then('it should not save', () => {
      expect(mockSaveNow).not.toHaveBeenCalled()
    })
  })

  BddTest().when('a required publish field is missing', () => {
    beforeEach(() => {
      mountActions()
    })

    BddTest().then('it should disable the publish button', () => {
      expect(getPublishButton().props('disabled')).toBe(true)
    })

    BddTest().then('it should explain why the publish button is disabled', () => {
      expect(getPublishButton().props('disabledTooltip')).toBe(REQUIRED_FIELDS_ERROR)
    })

    BddTest().then('it should display the required fields warning', () => {
      expect(getWarningMessage().props('message')).toBe(REQUIRED_FIELDS_ERROR)
    })
  })

  BddTest().when('all required publish fields are provided', () => {
    beforeEach(() => {
      mountActions({ FormWrapper: EditNationalActivityViewFormWrapperValid })
    })

    BddTest().then('it should enable the publish button', () => {
      expect(getPublishButton().props('disabled')).toBe(false)
    })

    BddTest().then('it should not display the required fields warning', () => {
      expect(getWarningMessage().exists()).toBe(false)
    })
  })

  BddTest().when('a sub-activity is not publishable while a required publish field is missing', () => {
    beforeEach(() => {
      mountActions({ activity: mockedActivityPresentationWithUnpublishableSubActivities })
    })

    BddTest().then('it should explain the missing fields first', () => {
      expect(getPublishButton().props('disabledTooltip')).toBe(REQUIRED_FIELDS_ERROR)
      expect(getWarningMessage().props('message')).toBe(REQUIRED_FIELDS_ERROR)
    })
  })

  BddTest().when('a sub-activity is not publishable while all required publish fields are provided', () => {
    beforeEach(() => {
      mountActions({
        FormWrapper: EditNationalActivityViewFormWrapperValid,
        activity: mockedActivityPresentationWithUnpublishableSubActivities,
      })
    })

    BddTest().then('it should disable the publish button', () => {
      expect(getPublishButton().props('disabled')).toBe(true)
    })

    BddTest().then('it should explain that some sub-activities are not publishable', () => {
      expect(getPublishButton().props('disabledTooltip')).toBe(UNPUBLISHABLE_SUB_ACTIVITIES_ERROR)
      expect(getWarningMessage().props('message')).toBe(UNPUBLISHABLE_SUB_ACTIVITIES_ERROR)
    })
  })

  BddTest().when('the user does not have the publish right', () => {
    beforeEach(() => {
      mountActions({ FormWrapper: EditNationalActivityViewFormWrapperValid, hasPublishRight: false })
    })

    BddTest().then('it should disable the publish button with an explanatory tooltip', () => {
      expect(getPublishButton().props('disabled')).toBe(true)
      expect(getPublishButton().props('disabledTooltip')).toBe(PUBLISH_RIGHT_ONLY_TOOLTIP)
    })

    BddTest().then('it should not display the required fields warning', () => {
      expect(getWarningMessage().exists()).toBe(false)
    })
  })

  BddTest().when('publish is clicked with valid fields', () => {
    beforeEach(async () => {
      mountActions({ FormWrapper: EditNationalActivityViewFormWrapperValid })
      await getPublishButton().trigger('click')
    })

    BddTest().then('it should open the confirmation modal', async () => {
      await vi.waitFor(() => {
        expect(getConfirmationModal().props('opened')).toBe(true)
      })
    })
  })

  BddTest().when('publication is confirmed successfully', () => {
    beforeEach(async () => {
      mountActions({ FormWrapper: EditNationalActivityViewFormWrapperValid })
      await confirmPublication()
    })

    BddTest().then('it should emit published', async () => {
      await vi.waitFor(() => {
        expect(actions.emitted('published')).toBeTruthy()
      })
    })

    BddTest().then('it should show a success message', async () => {
      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalledWith('L\'activité a été publiée avec succès')
      })
    })
  })

  BddTest().when('publication fails', () => {
    beforeEach(async () => {
      mountActions({
        FormWrapper: EditNationalActivityViewFormWrapperValid,
        activity: { ...mockedActivityDetail, id: 'INVALID_ACTIVITY_DRAFT_ID' },
      })
      await confirmPublication()
    })

    BddTest().then('it should show an error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Une erreur est survenue lors de la publication de l\'activité',
        }))
      })
    })

    BddTest().then('it should not emit published', () => {
      expect(actions.emitted('published')).toBeFalsy()
    })
  })

  BddTest().when('the next step configuration is enabled', () => {
    beforeEach(() => {
      mountActions({ nextStepConfig: true })
    })

    BddTest().then('it should render the next step button', () => {
      expect(findByTestId('activity-content-tab-next-step-button').exists()).toBe(true)
    })

    BddTest().then('it should not render the publish button', () => {
      expect(findByTestId('publish-button').exists()).toBe(false)
    })

    BddTest().then('it should render the save button', () => {
      expect(findByTestId('save-button').exists()).toBe(true)
    })

    BddTest().and('the next step button is clicked', () => {
      beforeEach(async () => {
        await getNextStepButton().trigger('click')
      })

      BddTest().then('it should emit nextStep', () => {
        expect(actions.emitted('nextStep')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the next step configuration is enabled and the view is busy', () => {
    beforeEach(() => {
      mockIsBusy.value = true
      mountActions({ nextStepConfig: true })
    })

    BddTest().then('the next step button should be loading', () => {
      expect(getNextStepButton().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('the activity is a sub-activity', () => {
    beforeEach(() => {
      mountActions({ activity: mockedSubActivityDetail })
    })

    BddTest().then('it should render the exit button', () => {
      expect(findByTestId('exit-button').exists()).toBe(true)
    })

    BddTest().then('it should not render the save button', () => {
      expect(findByTestId('save-button').exists()).toBe(false)
    })

    BddTest().then('it should not render the publish button', () => {
      expect(findByTestId('publish-button').exists()).toBe(false)
    })

    BddTest().then('it should not render the next step button', () => {
      expect(findByTestId('activity-content-tab-next-step-button').exists()).toBe(false)
    })

    BddTest().then('it should display the sub-activity required fields warning', () => {
      expect(getWarningMessage().props('message')).toBe(REQUIRED_FIELDS_SUB_ACTIVITY_ERROR)
    })
  })

  BddTest().when('the activity is a sub-activity with all its required fields provided', () => {
    beforeEach(() => {
      mountActions({
        FormWrapper: EditNationalActivityViewFormWrapperValid,
        activity: mockedSubActivityDetail,
      })
    })

    BddTest().then('it should not display the required fields warning', () => {
      expect(getWarningMessage().exists()).toBe(false)
    })
  })
})
