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
import { type AvCancelConfirmButtonsProps, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, AvCancelConfirmButtonsStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const EXIT_LABEL = 'Quitter'
const SEND_LABEL = 'Envoyer'
const UPDATE_LABEL = 'Mettre à jour le feedback'
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
  AvCancelConfirmButtons: AvCancelConfirmButtonsStub
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

function getButtons (wrapper: VueWrapper) {
  return wrapper.findComponent(AvCancelConfirmButtonsStub)
}

function getBadge (wrapper: VueWrapper) {
  return wrapper.findComponent(AvBadgeStub)
}

async function emitConfirm (wrapper: VueWrapper) {
  await getButtons(wrapper).vm.$emit('confirm')
}

async function emitCancel (wrapper: VueWrapper) {
  await getButtons(wrapper).vm.$emit('cancel')
}

async function waitForEmit (wrapper: VueWrapper, eventName: string) {
  await vi.waitFor(() => {
    expect(wrapper.emitted(eventName)).toBeTruthy()
  })
}

function expectFormFieldsReadonly (wrapper: VueWrapper, readonly: boolean) {
  expect(wrapper.findComponent(FeedbackFormFieldStub).props('readonly')).toBe(readonly)
  expect(wrapper.findComponent(FeedbackAttachmentsFormFieldStub).props('readonly')).toBe(readonly)
}

function expectButtons (wrapper: VueWrapper, expected: AvCancelConfirmButtonsProps) {
  const buttons = getButtons(wrapper)
  for (const [key, value] of Object.entries(expected)) {
    if (value !== undefined) {
      expect(buttons.props(key)).toBe(value)
    }
  }
}

async function expectErrorToast (title: string) {
  await vi.waitFor(() => {
    expect(addErrorMessageMock).toHaveBeenCalledWith({
      title,
      description: API_ERROR_DESCRIPTION
    })
  })
}

BddTest().given('a write feedback tab with a draft feedback', () => {
  let wrapper: TabWrapper

  beforeEach(async () => {
    wrapper = await mountTab(draftFeedback)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should not render the saved badge initially', () => {
      expect(getBadge(wrapper).exists()).toBe(false)
    })

    BddTest().then('it should not mark form fields as readonly', () => {
      expectFormFieldsReadonly(wrapper, false)
    })

    BddTest().then('it should render the expected button labels and icon', () => {
      expectButtons(wrapper, {
        cancelLabel: EXIT_LABEL,
        confirmLabel: SEND_LABEL,
        confirmIcon: MS_ICONS.SEND_OUTLINE_ROUNDED
      })
    })

    BddTest().then('it should not disable the confirm button', () => {
      expectButtons(wrapper, { confirmDisabled: false })
    })
  })

  BddTest().when('the user emits cancel', () => {
    BddTest().then('it should emit cancel', async () => {
      await emitCancel(wrapper)
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })
  })

  BddTest().when('the user confirms (send) successfully', () => {
    BddTest().then('it should show a success toast with the exact message and emit feedbackSent', async () => {
      await emitConfirm(wrapper)
      await waitForEmit(wrapper, 'feedbackSent')

      expect(addSuccessMessageMock).toHaveBeenCalledExactlyOnceWith(SEND_SUCCESS_MESSAGE)
      expect(wrapper.emitted('feedbackSaved')).toBeFalsy()
      expect(getBadge(wrapper).exists()).toBe(false)
    })
  })

  BddTest().when('the user confirms (send) and it fails', () => {
    beforeEach(async () => {
      wrapper = await mountTab(invalidDraftFeedback)
    })

    BddTest().then('it should show an error toast with the current (save) title and description', async () => {
      await emitConfirm(wrapper)
      await expectErrorToast(SEND_ERROR_TITLE)

      expect(wrapper.emitted('feedbackSent')).toBeFalsy()
      expect(addSuccessMessageMock).not.toHaveBeenCalled()
    })
  })
})

BddTest().given('a write feedback tab with a submitted feedback', () => {
  let wrapper: TabWrapper

  beforeEach(async () => {
    wrapper = await mountTab(submittedFeedback)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should not mark form fields as readonly', () => {
      expectFormFieldsReadonly(wrapper, false)
    })

    BddTest().then('it should render the update label with the same confirm icon', () => {
      expectButtons(wrapper, {
        cancelLabel: EXIT_LABEL,
        confirmLabel: UPDATE_LABEL,
        confirmIcon: MS_ICONS.SEND_OUTLINE_ROUNDED
      })
    })
  })

  BddTest().when('the user confirms (manual update) successfully', () => {
    BddTest().then('it should show the saved badge with the exact label and emit feedbackSaved', async () => {
      await emitConfirm(wrapper)
      await waitForEmit(wrapper, 'feedbackSaved')

      expect(getBadge(wrapper).props('label')).toBe(SAVED_BADGE_LABEL)
      expect(wrapper.emitted('feedbackSent')).toBeFalsy()
      expect(addSuccessMessageMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the user confirms (manual update) and it fails', () => {
    beforeEach(async () => {
      wrapper = await mountTab(invalidSubmittedFeedback)
    })

    BddTest().then('it should show an error toast and not emit feedbackSaved', async () => {
      await emitConfirm(wrapper)
      await expectErrorToast(SAVE_ERROR_TITLE)

      expect(wrapper.emitted('feedbackSaved')).toBeFalsy()
      expect(getBadge(wrapper).exists()).toBe(false)
    })
  })
})

BddTest().given('a write feedback tab with a seen feedback', () => {
  let wrapper: TabWrapper

  beforeEach(async () => {
    wrapper = await mountTab(seenFeedback)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should mark both form fields as readonly', () => {
      expectFormFieldsReadonly(wrapper, true)
    })

    BddTest().then('it should render the update label but disable the confirm button', () => {
      expectButtons(wrapper, {
        cancelLabel: EXIT_LABEL,
        confirmLabel: UPDATE_LABEL,
        confirmDisabled: true
      })
    })
  })

  BddTest().when('the user tries to confirm', () => {
    BddTest().then('it should not call the API nor emit anything', async () => {
      await emitConfirm(wrapper)

      expect(wrapper.emitted('feedbackSaved')).toBeFalsy()
      expect(wrapper.emitted('feedbackSent')).toBeFalsy()
      expect(addSuccessMessageMock).not.toHaveBeenCalled()
      expect(addErrorMessageMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the user emits cancel', () => {
    BddTest().then('it should emit cancel', async () => {
      await emitCancel(wrapper)
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })
  })
})
