import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import type { mount, VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { EActivityThematic } from '@/api/avenir-esr'
import { ActivityExecutionPeriodFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.stub'
import { ActivitySummaryFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivitySummaryFormField/ActivitySummaryFormField.stub'
import { ActivityTitleFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityTitleFormField/ActivityTitleFormField.stub'
import { ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { PublicationSectionId } from '@/features/staff/activities/editActivity.constants'
import ActivityPublicationTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityPublicationTab/ActivityPublicationTab.vue'
import { mockSave } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.stub'
import { provideEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { FormFieldCardContainerStub } from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { h } from 'vue'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

const { hasFieldErrorsMock, hasFieldErrorsRef } = vi.hoisted(() => {
  return {
    hasFieldErrorsMock: vi.fn(),
    hasFieldErrorsRef: { value: false },
  }
})

vi.mock('@/common/composables/use-form-validators/use-form-validators', () => ({
  useFormValidators: () => ({
    hasFieldErrors: hasFieldErrorsMock,
  }),
}))

const ConfirmationModalStub = defineComponent({
  name: 'ConfirmationModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['confirm', 'close'],
  template: `
    <div data-testid="confirmation-modal" :data-show="show ? 'true' : 'false'">
      <button data-testid="confirm-publication" @click="$emit('confirm')">confirm</button>
      <button data-testid="close-publication" @click="$emit('close')">close</button>
    </div>
  `,
})

const EditNationalActivityViewFormWrapperValid = defineComponent({
  name: 'EditNationalActivityViewFormWrapperValid',
  template: '<div><slot /></div>',
  setup () {
    const defaultValues: EditActivityFormData = {
      title: 'Valid activity',
      thematic: EActivityThematic.TRANSVERSAL,
      description: '',
      enableReflection: true,
      executionPeriodInfo: '',
      feedbackAllowedIterations: undefined,
      summary: 'Valid summary',
      traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
    }

    const form = useForm({
      defaultValues,
      validators: {
        onSubmit ({ value }: { value: EditActivityFormData }) {
          return {
            fields: {
              title: value.title ? undefined : 'Ce champ est requis.',
              summary: value.summary ? undefined : 'Ce champ est requis.',
            }
          }
        }
      },
    })

    provideEditNationalActivityViewContext({
      form,
      isUpdating: ref(false),
      save: mockSave,
      cancel: vi.fn(),
    })
  },
})

const EditNationalActivityViewFormWrapperInvalid = defineComponent({
  name: 'EditNationalActivityViewFormWrapperInvalid',
  template: '<div><slot /></div>',
  setup () {
    const defaultValues: EditActivityFormData = {
      title: 'Valid activity',
      thematic: EActivityThematic.TRANSVERSAL,
      description: '',
      enableReflection: true,
      executionPeriodInfo: '',
      feedbackAllowedIterations: undefined,
      summary: '',
      traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
    }

    const form = useForm({
      defaultValues,
      validators: {
        onSubmit ({ value }: { value: EditActivityFormData }) {
          return {
            fields: {
              title: value.title ? undefined : 'Ce champ est requis.',
              summary: value.summary ? undefined : 'Ce champ est requis.',
            }
          }
        }
      },
    })

    provideEditNationalActivityViewContext({
      form,
      isUpdating: ref(false),
      save: mockSave,
      cancel: vi.fn(),
    })
  },
})

BddTest().given('an ActivityPublicationTab component', () => {
  let wrapper: ReturnType<typeof mount>
  let tab: VueWrapper<InstanceType<typeof ActivityPublicationTab>>

  const stubs = {
    AvButton: AvButtonStub,
    ConfirmationModal: ConfirmationModalStub,
    EditNationalActivityViewTabActions: true,
    ActivityTitleFormField: ActivityTitleFormFieldStub,
    ActivitySummaryFormField: ActivitySummaryFormFieldStub,
    ActivityExecutionPeriodFormField: ActivityExecutionPeriodFormFieldStub,
    FormFieldCardContainer: FormFieldCardContainerStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    hasFieldErrorsRef.value = false
    hasFieldErrorsMock.mockImplementation(() => hasFieldErrorsRef)
    wrapper = mountComponent(EditNationalActivityViewFormWrapperInvalid, {
      slots: { default: h(ActivityPublicationTab, { activity: mockedActivityContent }) },
      global: { stubs },
    })
    tab = wrapper.findComponent(ActivityPublicationTab)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(tab.exists()).toBe(true)
    })

    BddTest().then('it should render FormFieldCardContainer', () => {
      expect(tab.findComponent({ name: 'FormFieldCardContainer' }).exists()).toBe(true)
    })

    BddTest().then('it should render ActivitySummaryFormField', () => {
      expect(tab.findComponent({ name: 'ActivitySummaryFormField' }).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityTitleFormField', () => {
      expect(tab.findComponent({ name: 'ActivityTitleFormField' }).exists()).toBe(true)
    })

    BddTest().then('it should render the SUMMARY_CONTEXT section anchor', () => {
      expect(tab.find(`#${PublicationSectionId.SUMMARY_CONTEXT}`).exists()).toBe(true)
    })

    BddTest().then('it should pass the form to ActivitySummaryFormField', () => {
      const summaryField = tab.findComponent(ActivitySummaryFormFieldStub)
      expect(summaryField.props('form')).toBeTruthy()
    })

    BddTest().then('it should pass the form to ActivityExecutionPeriodFormField', () => {
      const executionPeriodField = tab.findComponent(ActivityExecutionPeriodFormFieldStub)
      expect(executionPeriodField.props('form')).toBeTruthy()
    })
  })

  BddTest().when('ActivitySummaryFormField emits autosave', () => {
    beforeEach(() => {
      tab.findComponent(ActivitySummaryFormFieldStub).vm.$emit('autosave', { summary: 'Resume MAJ' })
    })

    BddTest().then('it should call save from the view context', () => {
      expect(mockSave).toHaveBeenCalledWith({ summary: 'Resume MAJ' })
    })
  })

  BddTest().when('ActivityTitleFormField emits autosave', () => {
    beforeEach(() => {
      tab.findComponent(ActivityTitleFormFieldStub).vm.$emit('autosave', { title: 'Titre MAJ' })
    })

    BddTest().then('it should call save from the view context', () => {
      expect(mockSave).toHaveBeenCalledWith({ title: 'Titre MAJ' })
    })
  })

  BddTest().when('ActivityExecutionPeriodFormField emits autosave', () => {
    beforeEach(() => {
      tab.findComponent(ActivityExecutionPeriodFormFieldStub).vm.$emit('autosave', { executionPeriod: 'Période MAJ' })
    })

    BddTest().then('it should call save from the view context', () => {
      expect(mockSave).toHaveBeenCalledWith({ executionPeriod: 'Période MAJ' })
    })
  })

  BddTest().when('publish is clicked with invalid required fields', () => {
    beforeEach(async () => {
      hasFieldErrorsRef.value = true
      await tab.find('[data-testid="publish-button"]').trigger('click')
    })

    BddTest().then('it should keep confirmation modal closed', async () => {
      await vi.waitFor(() => expect(tab.find('[data-testid="confirmation-modal"]').attributes('data-show')).toBe('false'))
    })
  })

  BddTest().when('publish is clicked with valid required fields', () => {
    beforeEach(async () => {
      hasFieldErrorsRef.value = false
      wrapper = mountComponent(EditNationalActivityViewFormWrapperValid, {
        slots: { default: h(ActivityPublicationTab, { activity: mockedActivityContent }) },
        global: { stubs },
      })
      tab = wrapper.findComponent(ActivityPublicationTab)
      await tab.find('[data-testid="publish-button"]').trigger('click')
    })

    BddTest().then('it should open confirmation modal', async () => {
      await vi.waitFor(() => expect(tab.find('[data-testid="confirmation-modal"]').attributes('data-show')).toBe('true'))
    })
  })

  BddTest().when('publication is confirmed successfully', () => {
    beforeEach(async () => {
      hasFieldErrorsRef.value = false
      wrapper = mountComponent(EditNationalActivityViewFormWrapperValid, {
        slots: { default: h(ActivityPublicationTab, { activity: mockedActivityContent }) },
        global: { stubs },
      })
      tab = wrapper.findComponent(ActivityPublicationTab)

      await tab.find('[data-testid="publish-button"]').trigger('click')
      await vi.waitFor(() => expect(tab.find('[data-testid="confirmation-modal"]').attributes('data-show')).toBe('true'))
      await tab.find('[data-testid="confirm-publication"]').trigger('click')
    })

    BddTest().then('it should emit published', async () => {
      await vi.waitFor(() => {
        expect(tab.emitted('published')).toBeTruthy()
      })
    })

    BddTest().then('it should show a success message', async () => {
      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('publication is confirmed but an error occurs', () => {
    beforeEach(async () => {
      hasFieldErrorsRef.value = false
      wrapper = mountComponent(EditNationalActivityViewFormWrapperValid, {
        slots: { default: h(ActivityPublicationTab, {
          activity: { ...mockedActivityContent, id: 'INVALID_ACTIVITY_DRAFT_ID' }
        }) },
        global: { stubs },
      })
      tab = wrapper.findComponent(ActivityPublicationTab)

      await tab.find('[data-testid="publish-button"]').trigger('click')
      await vi.waitFor(() => expect(tab.find('[data-testid="confirmation-modal"]').attributes('data-show')).toBe('true'))
      await tab.find('[data-testid="confirm-publication"]').trigger('click')
    })

    BddTest().then('it should not emit published', async () => {
      await vi.waitFor(() => {
        expect(tab.emitted('published')).toBeFalsy()
      })
    })

    BddTest().then('it should show an error message', async () => {
      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
    })
  })
})
