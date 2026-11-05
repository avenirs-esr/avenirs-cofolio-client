import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { FormCancelConfirmButtonsStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedAlertConfigurationDTO } from '@/__mocks__/fixtures/global-alert.fixtures'
import AlertUpdateForm from '@/features/global-alert/views/AlertUpdateView/components/forms/AlertUpdateForm/AlertUpdateForm.vue'
import { AlertActiveToggleFormFieldStub } from '@/features/global-alert/views/AlertUpdateView/components/interactions/formFields/AlertActiveToggleFormField/AlertActiveToggleFormField.stub'
import { AlertMessageRichTextEditorFormFieldStub } from '@/features/global-alert/views/AlertUpdateView/components/interactions/formFields/AlertMessageRichTextEditorFormField/AlertMessageRichTextEditorFormField.stub'
import { AlertPeriodFormFieldStub } from '@/features/global-alert/views/AlertUpdateView/components/interactions/formFields/AlertPeriodFormField/AlertPeriodFormField.stub'
import { useUpdateAlertForm } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'

const mockHandleSubmit = vi.fn()
const mockIsActive = ref(false)
const mockIsDirty = ref(false)
const mockIsFormValid = ref(false)
const mockIsSubmitting = ref(false)
const mockForm = {
  handleSubmit: mockHandleSubmit,
  useStore: () => mockIsDirty,
}
const mockOnAlertUpdated = vi.fn()

vi.mock('@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form', () => ({
  useUpdateAlertForm: vi.fn((_alert: unknown, onAlertUpdated: () => void) => {
    mockOnAlertUpdated.mockImplementation(onAlertUpdated)
    return {
      form: mockForm,
      isActive: mockIsActive,
      isFormValid: mockIsFormValid,
      isSubmitting: mockIsSubmitting,
    }
  })
}))

BddTest().given('an AlertUpdateForm component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AlertUpdateForm>>

  const stubs = {
    AlertActiveToggleFormField: AlertActiveToggleFormFieldStub,
    AlertMessageRichTextEditorFormField: AlertMessageRichTextEditorFormFieldStub,
    AlertPeriodFormField: AlertPeriodFormFieldStub,
    FormCancelConfirmButtons: FormCancelConfirmButtonsStub,
  }

  const getForm = () => wrapper.find('form')
  const getMessageField = () => wrapper.findComponent(AlertMessageRichTextEditorFormFieldStub)
  const getActiveField = () => wrapper.findComponent(AlertActiveToggleFormFieldStub)
  const getPeriodField = () => wrapper.findComponent(AlertPeriodFormFieldStub)
  const getButtons = () => wrapper.findComponent(FormCancelConfirmButtonsStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsActive.value = false
    mockIsDirty.value = false
    mockIsFormValid.value = false
    mockIsSubmitting.value = false

    wrapper = mountComponent(AlertUpdateForm, {
      props: {
        alert: mockedAlertConfigurationDTO,
      },
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should create the form from the alert', () => {
      expect(useUpdateAlertForm).toHaveBeenCalledWith(mockedAlertConfigurationDTO, expect.any(Function))
    })

    BddTest().then('it should give the form to every field', () => {
      expect(getMessageField().props('form')).toBe(mockForm)
      expect(getActiveField().props('form')).toBe(mockForm)
      expect(getPeriodField().props('form')).toBe(mockForm)
    })

    BddTest().then('it should not disable the period field', () => {
      expect(getPeriodField().props('disabled')).toBe(false)
    })

    BddTest().then('it should link the buttons to the form', () => {
      const formId = getForm().attributes('id')
      expect(formId).toBeTruthy()
      expect(getButtons().props('form')).toBe(formId)
    })

    BddTest().then('it should forward the initial state to the buttons', () => {
      expect(getButtons().props()).toMatchObject({
        isFormValid: false,
        isSubmitting: false
      })
    })

    BddTest().then('it should emit the initial dirty state', () => {
      expect(wrapper.emitted('dirtyChange')).toEqual([[false]])
    })
  })

  BddTest().when('the alert is active', () => {
    beforeEach(async () => {
      mockIsActive.value = true
      await flushPromises()
    })

    BddTest().then('it should disable the period field', () => {
      expect(getPeriodField().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the form is valid and submitting', () => {
    beforeEach(async () => {
      mockIsFormValid.value = true
      mockIsSubmitting.value = true
      await flushPromises()
    })

    BddTest().then('it should forward the state to the buttons', () => {
      expect(getButtons().props()).toMatchObject({
        isFormValid: true,
        isSubmitting: true
      })
    })
  })

  BddTest().when('the form becomes dirty', () => {
    beforeEach(async () => {
      mockIsDirty.value = true
      await flushPromises()
    })

    BddTest().then('it should emit the new dirty state', () => {
      expect(wrapper.emitted('dirtyChange')).toEqual([[false], [true]])
    })
  })

  BddTest().when('the form is submitted', () => {
    beforeEach(async () => {
      await getForm().trigger('submit')
    })

    BddTest().then('it should submit the form', () => {
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('the alert is updated', () => {
    beforeEach(() => {
      mockOnAlertUpdated()
    })

    BddTest().then('it should emit alertUpdated', () => {
      expect(wrapper.emitted('alertUpdated')).toHaveLength(1)
    })
  })

  BddTest().when('the cancel button is clicked', () => {
    beforeEach(() => {
      getButtons().vm.$emit('cancel')
    })

    BddTest().then('it should emit cancel', () => {
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })
  })
})
