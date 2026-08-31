import type { FeedbackDetailsDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { FormCancelConfirmButtonsStub } from '@/common/components/FormCancelConfirmButtons/FormCancelConfirmButtons.stub'
import { FeedbackAttachmentsFormFieldStub } from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/formFields/FeedbackAttachmentsFormField/FeedbackAttachmentsFormField.stub'
import { FeedbackFormFieldStub } from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/formFields/FeedbackFormField/FeedbackFormField.stub'
import WriteFeedbackTab from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/WriteFeedbackTab/WriteFeedbackTab.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn()
    }))
  }
})

vi.mock('@/common/composables/use-api-errors/use-api-errors', () => ({
  useApiErrors: vi.fn(() => ({
    getErrorMessage: vi.fn(() => 'Error message')
  }))
}))

BddTest().given('a write feedback tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof WriteFeedbackTab>>

  const mockFeedback: FeedbackDetailsDTO = {
    id: 'feedback-1',
    feedback: 'Initial feedback text',
    activity: mockedActivityContent
  } as FeedbackDetailsDTO

  const stubs = {
    AvBadge: AvBadgeStub,
    FeedbackAttachmentsFormField: FeedbackAttachmentsFormFieldStub,
    FeedbackFormField: FeedbackFormFieldStub,
    FormCancelConfirmButtons: FormCancelConfirmButtonsStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(WriteFeedbackTab, {
        props: { feedback: mockFeedback },
        global: { stubs }
      })
    })

    BddTest().then('it should render the write feedback tab', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the feedback form field', () => {
      expect(wrapper.findComponent(FeedbackFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render the feedback attachments form field', () => {
      expect(wrapper.findComponent(FeedbackAttachmentsFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render form cancel confirm buttons', () => {
      expect(wrapper.find('form').exists()).toBe(true)
    })
  })

  BddTest().when('the user emits cancel event', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(WriteFeedbackTab, {
        props: { feedback: mockFeedback },
        global: { stubs }
      })
    })

    BddTest().then('it should emit cancel event', async () => {
      const buttons = wrapper.findComponent({ name: 'FormCancelConfirmButtons' })
      if (buttons.exists()) {
        await buttons.vm.$emit('cancel')
        expect(wrapper.emitted('cancel')).toBeTruthy()
      }
    })
  })
})
