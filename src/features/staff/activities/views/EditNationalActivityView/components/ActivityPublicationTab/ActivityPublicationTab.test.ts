import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ActivityBannerFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityBannerFormField/ActivityBannerFormField.stub'
import { ActivityExecutionPeriodFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.stub'
import { ActivitySummaryFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivitySummaryFormField/ActivitySummaryFormField.stub'
import { ActivityTitleFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.stub'
import ActivityPublicationTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityPublicationTab/ActivityPublicationTab.vue'
import { EditNationalActivityViewTabActionsStub } from '@/features/staff/activities/views/EditNationalActivityView/components/EditNationalActivityViewTabActions/EditNationalActivityViewTabActions.stub'
import {
  EditNationalActivityViewFormWrapper,
  EditNationalActivityViewFormWrapperDirty,
  EditNationalActivityViewFormWrapperValid,
} from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'
import { IconTitleCardContainerStub } from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { AvButtonStub, AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'

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

vi.mock('@/common/composables/use-task-loading/use-task-loading', () => ({
  useTaskLoading: () => ({
    isLoading: ref(false),
    withTaskLoading: async (task: () => Promise<unknown> | unknown) => await task(),
  }),
}))

const ConfirmationModalStub = defineComponent({
  name: 'ConfirmationModal',
  props: {
    show: { type: Boolean, default: false },
  },
  emits: ['confirm', 'close'],
  template: `
    <div data-testid="publish-confirmation-modal" :data-show="show ? 'true' : 'false'">
      <button data-testid="confirm-publication" @click="$emit('confirm')">confirm</button>
      <button data-testid="close-publication" @click="$emit('close')">close</button>
    </div>
  `,
})

type FormWrapperComponent
  = | typeof EditNationalActivityViewFormWrapper
    | typeof EditNationalActivityViewFormWrapperDirty
    | typeof EditNationalActivityViewFormWrapperValid

BddTest().given('an ActivityPublicationTab component', () => {
  let wrapper: ReturnType<typeof mountComponent>
  let tab: VueWrapper<InstanceType<typeof ActivityPublicationTab>>

  const stubs = {
    AvButton: AvButtonStub,
    AvMessage: AvMessageStub,
    ConfirmationModal: ConfirmationModalStub,
    EditNationalActivityViewTabActions: EditNationalActivityViewTabActionsStub,
    ActivityTitleFormField: ActivityTitleFormFieldStub,
    ActivityBannerFormField: ActivityBannerFormFieldStub,
    ActivitySummaryFormField: ActivitySummaryFormFieldStub,
    ActivityExecutionPeriodFormField: ActivityExecutionPeriodFormFieldStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
  }

  function mountTab (
    FormWrapper: FormWrapperComponent,
    activity = mockedActivityDetail,
  ) {
    wrapper = mountComponent(FormWrapper, {
      slots: { default: h(ActivityPublicationTab, { modelValue: null, activity }) },
      global: { stubs },
    })

    tab = wrapper.findComponent(ActivityPublicationTab)
  }

  const getPublishButton = () => tab.findAllComponents(AvButtonStub).find(c => c.attributes('data-testid') === 'publish-button')!

  beforeEach(() => {
    vi.clearAllMocks()
    mountTab(EditNationalActivityViewFormWrapper)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render IconTitleCardContainer', () => {
      expect(tab.findComponent(IconTitleCardContainerStub).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityTitleFormField', () => {
      expect(tab.findComponent(ActivityTitleFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityBannerFormField', () => {
      expect(tab.findComponent(ActivityBannerFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render ActivitySummaryFormField', () => {
      expect(tab.findComponent(ActivitySummaryFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityExecutionPeriodFormField', () => {
      expect(tab.findComponent(ActivityExecutionPeriodFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render EditNationalActivityViewTabActions', () => {
      expect(tab.findComponent(EditNationalActivityViewTabActionsStub).exists()).toBe(true)
    })

    BddTest().then('it should render the publish button', () => {
      expect(getPublishButton().exists()).toBe(true)
    })

    BddTest().then('it should render ConfirmationModal', () => {
      expect(tab.findComponent(ConfirmationModalStub).exists()).toBe(true)
    })
  })

  BddTest().when('a required publish field is missing', () => {
    BddTest().then('it should disable the publish button', () => {
      expect(getPublishButton().props('disabled')).toBe(true)
    })

    BddTest().then('it should display the required fields warning', () => {
      expect(tab.findComponent(AvMessageStub).exists()).toBe(true)
    })
  })

  BddTest().when('all required publish fields are provided', () => {
    beforeEach(() => {
      mountTab(EditNationalActivityViewFormWrapperValid)
    })

    BddTest().then('it should enable the publish button', () => {
      expect(getPublishButton().props('disabled')).toBe(false)
    })

    BddTest().then('it should not display the required fields warning', () => {
      expect(tab.findComponent(AvMessageStub).exists()).toBe(false)
    })
  })

  BddTest().when('the form is dirty', () => {
    beforeEach(async () => {
      mountTab(EditNationalActivityViewFormWrapperDirty)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should mark the publish button as loading', () => {
      expect(getPublishButton().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('publish is clicked with valid fields', () => {
    beforeEach(async () => {
      mountTab(EditNationalActivityViewFormWrapperValid)
      await getPublishButton().trigger('click')
    })

    BddTest().then('it should open confirmation modal', async () => {
      await vi.waitFor(() => {
        expect(tab.find('[data-testid="publish-confirmation-modal"]').attributes('data-show'))
          .toBe('true')
      })
    })
  })

  BddTest().when('publication is confirmed successfully', () => {
    beforeEach(async () => {
      mountTab(EditNationalActivityViewFormWrapperValid)

      await getPublishButton().trigger('click')

      await vi.waitFor(() => {
        expect(tab.find('[data-testid="publish-confirmation-modal"]').attributes('data-show'))
          .toBe('true')
      })

      await tab.find('[data-testid="confirm-publication"]').trigger('click')
    })

    BddTest().then('it should emit published', async () => {
      await vi.waitFor(() => {
        expect(tab.emitted('published')).toBeTruthy()
      })
    })

    BddTest().then('it should show success message', async () => {
      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('publication fails', () => {
    beforeEach(async () => {
      mountTab(EditNationalActivityViewFormWrapperValid, {
        ...mockedActivityDetail,
        id: 'INVALID_ACTIVITY_DRAFT_ID',
      })

      await getPublishButton().trigger('click')

      await vi.waitFor(() => {
        expect(tab.find('[data-testid="publish-confirmation-modal"]').attributes('data-show'))
          .toBe('true')
      })

      await tab.find('[data-testid="confirm-publication"]').trigger('click')
    })

    BddTest().then('it should not emit published', async () => {
      await vi.waitFor(() => {
        expect(tab.emitted('published')).toBeFalsy()
      })
    })

    BddTest().then('it should show error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
    })
  })
})
