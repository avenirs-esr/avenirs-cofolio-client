import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RichTextEditorStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedCguDTO } from '@/__mocks__/fixtures/cgu.fixtures'
import TermsOfServiceUpdateForm from '@/features/terms-of-service/views/TermsOfServiceView/components/forms/TermsOfServiceUpdateForm/TermsOfServiceUpdateForm.vue'
import { useUpdateTermsOfServicesForm } from '@/features/terms-of-service/views/TermsOfServiceView/composables/use-update-terms-of-services-form/use-update-terms-of-services-form'

const mockHandleSubmit = vi.fn()
const mockHandleChange = vi.fn()
const mockIsDirty = ref(false)
const mockIsFormValid = ref(false)
const mockIsSubmitting = ref(false)

const mockFieldState = {
  value: '<p>Initial</p>',
  meta: {
    errors: [] as string[],
  },
}

const mockForm = {
  handleSubmit: mockHandleSubmit,
  useStore: vi.fn(() => mockIsDirty),
  Field: defineComponent({
    name: 'FormField',
    props: {
      name: {
        type: String,
        required: true,
      },
    },
    setup (_, { slots }) {
      return () => slots.default?.({
        field: {
          state: mockFieldState,
          handleChange: mockHandleChange,
        },
      })
    },
  }),
}

vi.mock('@/features/terms-of-service/views/TermsOfServiceView/composables/use-update-terms-of-services-form/use-update-terms-of-services-form', () => ({
  useUpdateTermsOfServicesForm: vi.fn(() => ({
    form: mockForm,
    isFormValid: mockIsFormValid,
    isSubmitting: mockIsSubmitting,
  })),
}))

BddTest().given('a TermsOfServiceUpdateForm component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TermsOfServiceUpdateForm>>

  const stubs = {
    AvButton: AvButtonStub,
    RichTextEditor: RichTextEditorStub,
  }

  const getForm = () => wrapper.find('form')
  const getRichTextEditor = () => wrapper.findComponent(RichTextEditorStub)
  const getPublishButton = () => wrapper.findComponent(AvButtonStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsDirty.value = false
    mockIsFormValid.value = false
    mockIsSubmitting.value = false

    wrapper = mountComponent(TermsOfServiceUpdateForm, {
      props: {
        cgu: mockedCguDTO,
      },
      global: { stubs },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should initialize the form with the provided cgu', () => {
      expect(useUpdateTermsOfServicesForm).toHaveBeenCalledWith(mockedCguDTO)
    })

    BddTest().then('it should render the rich text editor', () => {
      expect(getRichTextEditor().exists()).toBe(true)
      expect(getRichTextEditor().props('modelValue')).toBe(mockFieldState.value)
    })

    BddTest().then('it should link the publish button to the form', () => {
      const formId = getForm().attributes('id')
      expect(formId).toBeTruthy()
      expect(getPublishButton().attributes('form')).toBe(formId)
    })

    BddTest().then('it should disable the publish button and set disabled-tooltip when the form is invalid', () => {
      expect(getPublishButton().props('disabled')).toBe(true)
      expect(getPublishButton().props('disabledTooltip')).toBe('Le formulaire n\'est pas valide')
    })

    BddTest().then('it should emit the initial dirty state', () => {
      expect(wrapper.emitted('dirtyChange')).toEqual([[false]])
    })
  })

  BddTest().when('the rich text editor value updates', () => {
    BddTest().then('it should handle non-empty changes', async () => {
      getRichTextEditor().vm.$emit('update:modelValue', '<p>New text</p>')
      expect(mockHandleChange).toHaveBeenCalledWith('<p>New text</p>')
    })

    BddTest().then('it should handle empty paragraph changes as empty string', async () => {
      getRichTextEditor().vm.$emit('update:modelValue', '<p></p>')
      expect(mockHandleChange).toHaveBeenCalledWith('')
    })
  })

  BddTest().when('the form is valid and submitting', () => {
    beforeEach(async () => {
      mockIsFormValid.value = true
      mockIsSubmitting.value = true
      await flushPromises()
    })

    BddTest().then('it should enable and set loading on the publish button', () => {
      expect(getPublishButton().props('disabled')).toBe(false)
      expect(getPublishButton().props('isLoading')).toBe(true)
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
})
