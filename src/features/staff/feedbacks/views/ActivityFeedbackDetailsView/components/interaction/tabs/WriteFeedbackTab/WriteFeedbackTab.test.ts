import type { FeedbackDetailsDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import {
  mockedFeedbackDetailsSubmitted,
  mockedFeedbackDetailsWithAssociations
} from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import {
  EFeedbackStatus
} from '@/api/avenir-esr'
import { FeedbackAttachmentsFormFieldStub } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/formFields/FeedbackAttachmentsFormField/FeedbackAttachmentsFormField.stub'
import { FeedbackFormFieldStub } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/formFields/FeedbackFormField/FeedbackFormField.stub'
import WriteFeedbackTab from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/WriteFeedbackTab/WriteFeedbackTab.vue'
import { MDI_ICONS, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const EXIT_LABEL = 'Quitter'
const SAVE_LABEL = 'Enregistrer'
const SEND_LABEL = 'Envoyer'
const UPDATE_LABEL = 'Mettre à jour le feedback'
const SEEN_CONFIRM_DISABLED_TOOLTIP = 'Ce feedback a déjà été consulté et ne peut plus être modifié'
const SAVED_BADGE_LABEL = 'Enregistré'
const SEND_SUCCESS_MESSAGE = 'Le feedback a été envoyé avec succès'
const SEND_ERROR_TITLE = 'Une erreur est survenue lors de l\'envoi du feedback'
const SAVE_ERROR_TITLE = 'Une erreur est survenue lors de l\'enregistrement du feedback'
const API_ERROR_DESCRIPTION = 'Error message'

const addSuccessMessageMock = vi.fn()
const addErrorMessageMock = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addErrorMessage: addErrorMessageMock,
      addSuccessMessage: addSuccessMessageMock
    }))
  }
})

vi.mock('@/common/composables/use-api-errors/use-api-errors', () => ({
  useApiErrors: vi.fn(() => ({
    getErrorMessage: vi.fn(() => API_ERROR_DESCRIPTION)
  }))
}))

const stubs = {
  AvBadge: AvBadgeStub,
  FeedbackAttachmentsFormField: FeedbackAttachmentsFormFieldStub,
  FeedbackFormField: FeedbackFormFieldStub,
  AvButton: AvButtonStub
}

const draftFeedback: FeedbackDetailsDTO = {
  ...mockedFeedbackDetailsWithAssociations,
  status: EFeedbackStatus.NEW
}

const invalidDraftFeedback: FeedbackDetailsDTO = {
  ...draftFeedback,
  id: 'INVALID_FEEDBACK_ID'
}

const submittedFeedback: FeedbackDetailsDTO = mockedFeedbackDetailsSubmitted

const invalidSubmittedFeedback: FeedbackDetailsDTO = {
  ...submittedFeedback,
  id: 'INVALID_FEEDBACK_ID'
}

const seenFeedback: FeedbackDetailsDTO = {
  ...mockedFeedbackDetailsWithAssociations,
  id: 'feedback-seen',
  status: EFeedbackStatus.SEEN
}

type TabWrapper = VueWrapper<InstanceType<typeof WriteFeedbackTab>>

async function mountTab (feedback: FeedbackDetailsDTO): Promise<TabWrapper> {
  vi.clearAllMocks()
  const wrapper = mountComponent(WriteFeedbackTab, {
    props: { feedback },
    global: { stubs }
  })
  await flushPromises()
  return wrapper
}

BddTest().given('a write feedback tab', () => {
  let wrapper: TabWrapper

  const getBadge = () => wrapper.findComponent(AvBadgeStub)
  const getButtons = () => wrapper.findAllComponents(AvButtonStub)
  const getExitButton = () => getButtons().find(button => button.attributes('data-testid') === 'cancel-button')
  const getSaveButton = () => getButtons().find(button => button.attributes('data-testid') === 'save-button')
  const getConfirmButton = () => getButtons().find(button => button.attributes('data-testid') === 'confirm-button')
  const emitConfirm = () => getConfirmButton()?.vm.$emit('click')
  const emitCancel = () => getExitButton()?.vm.$emit('click')
  const emitSave = () => getSaveButton()?.vm.$emit('click')

  const expectFormFieldsReadonly = (readonly: boolean) => {
    expect(wrapper.findComponent(FeedbackFormFieldStub).props('readonly')).toBe(readonly)
    expect(wrapper.findComponent(FeedbackAttachmentsFormFieldStub).props('readonly')).toBe(readonly)
  }

  const waitForEmit = async (eventName: string) => {
    await vi.waitFor(() => {
      expect(wrapper.emitted(eventName)).toBeTruthy()
    })
  }

  const expectErrorToast = async (title: string) => {
    await vi.waitFor(() => {
      expect(addErrorMessageMock).toHaveBeenCalledWith({
        title,
        description: API_ERROR_DESCRIPTION
      })
    })
  }

  BddTest().when('the component is mounted with a draft feedback', () => {
    beforeEach(async () => {
      wrapper = await mountTab(draftFeedback)
    })

    BddTest().then('it should not render the saved badge initially', () => {
      expect(getBadge().exists()).toBe(false)
    })

    BddTest().then('it should not mark form fields as readonly', () => {
      expectFormFieldsReadonly(false)
    })

    BddTest().then('it should render the expected buttons labels and icon', () => {
      const exitButton = getExitButton()
      const saveButton = getSaveButton()
      const confirmButton = getConfirmButton()

      expect(exitButton?.exists()).toBe(true)
      expect(saveButton?.exists()).toBe(true)
      expect(confirmButton?.exists()).toBe(true)

      expect(exitButton!.props('label')).toBe(EXIT_LABEL)
      expect(exitButton!.props('icon')).toBe(MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
      expect(saveButton!.props('label')).toBe(SAVE_LABEL)
      expect(saveButton!.props('icon')).toBe(MDI_ICONS.CONTENT_SAVE_OUTLINE)
      expect(confirmButton!.props('label')).toBe(SEND_LABEL)
      expect(confirmButton!.props('icon')).toBe(MS_ICONS.SEND_OUTLINE_ROUNDED)
    })

    BddTest().then('it should only disable the save button', () => {
      expect(getExitButton()?.props('disabled')).toBe(false)
      expect(getSaveButton()?.props('disabled')).toBe(true)
      expect(getConfirmButton()?.props('disabled')).toBe(false)
    })
  })

  BddTest().when('the user emits cancel', () => {
    BddTest().then('it should emit cancel', async () => {
      emitCancel()
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })
  })

  BddTest().when('the user saves successfully', () => {
    BddTest().then('it should show a success toast with the exact message and emit feedbackSaved', async () => {
      emitSave()
      await waitForEmit('feedbackSaved')
      expect(wrapper.emitted('feedbackSent')).toBeFalsy()
      expect(getBadge().exists()).toBe(true)
    })
  })

  BddTest().when('the user confirms (send) successfully', () => {
    BddTest().then('it should show a success toast with the exact message and emit feedbackSent', async () => {
      emitConfirm()
      await waitForEmit('feedbackSent')

      expect(addSuccessMessageMock).toHaveBeenCalledExactlyOnceWith(SEND_SUCCESS_MESSAGE)
    })
  })

  BddTest().when('the user confirms (send) and it fails', () => {
    beforeEach(async () => {
      wrapper = await mountTab(invalidDraftFeedback)
    })

    BddTest().then('it should show an error toast with the current (save) title and description', async () => {
      await emitConfirm()
      await expectErrorToast(SEND_ERROR_TITLE)

      expect(wrapper.emitted('feedbackSent')).toBeFalsy()
      expect(addSuccessMessageMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the component is mounted with a submitted feedback', () => {
    beforeEach(async () => {
      wrapper = await mountTab(submittedFeedback)
    })

    BddTest().then('it should not mark form fields as readonly', () => {
      expectFormFieldsReadonly(false)
    })

    BddTest().then('it should render the update label with the same confirm icon', () => {
      const confirmButton = getConfirmButton()
      expect(confirmButton?.exists()).toBe(true)
      expect(confirmButton!.props('label')).toBe(UPDATE_LABEL)
      expect(confirmButton!.props('icon')).toBe(MS_ICONS.SEND_OUTLINE_ROUNDED)
    })
  })

  BddTest().when('the user confirms (manual update) successfully', () => {
    BddTest().then('it should show the saved badge with the exact label and emit feedbackSaved', async () => {
      emitConfirm()
      await waitForEmit('feedbackSaved')

      expect(getBadge().props('label')).toBe(SAVED_BADGE_LABEL)
      expect(wrapper.emitted('feedbackSent')).toBeFalsy()
      expect(addSuccessMessageMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the user confirms (manual update) and it fails', () => {
    beforeEach(async () => {
      wrapper = await mountTab(invalidSubmittedFeedback)
    })

    BddTest().then('it should show an error toast and not emit feedbackSaved', async () => {
      emitConfirm()
      await expectErrorToast(SAVE_ERROR_TITLE)

      expect(wrapper.emitted('feedbackSaved')).toBeFalsy()
      expect(getBadge().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a seen feedback', () => {
    beforeEach(async () => {
      wrapper = await mountTab(seenFeedback)
    })

    BddTest().then('it should mark both form fields as readonly', () => {
      expectFormFieldsReadonly(true)
    })

    BddTest().then('it should render the update label but disable the confirm button', () => {
      const confirmButton = getConfirmButton()
      expect(confirmButton?.exists()).toBe(true)
      expect(confirmButton!.props('label')).toBe(UPDATE_LABEL)
      expect(confirmButton!.props('icon')).toBe(MS_ICONS.SEND_OUTLINE_ROUNDED)
      expect(confirmButton!.props('disabled')).toBe(true)
      expect(confirmButton!.props('disabledTooltip')).toBe(SEEN_CONFIRM_DISABLED_TOOLTIP)
    })
  })

  BddTest().when('the user tries to confirm', () => {
    BddTest().then('it should not call the API nor emit anything', async () => {
      emitConfirm()

      expect(wrapper.emitted('feedbackSaved')).toBeFalsy()
      expect(wrapper.emitted('feedbackSent')).toBeFalsy()
      expect(addSuccessMessageMock).not.toHaveBeenCalled()
      expect(addErrorMessageMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the user emits cancel', () => {
    BddTest().then('it should emit cancel', async () => {
      emitCancel()
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })
  })
})
