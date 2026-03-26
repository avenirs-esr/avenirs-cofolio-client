import type { DeclaredProgramDetailedDTO } from '@/api/avenir-esr'
import { declaredProgramViewDTOFixture } from '@/__mocks__/fixtures/student/declaredPrograms.fixtures'
import { DeclaredProgramDescriptionFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramDescriptionFormField/DeclaredProgramDescriptionFormField.stub'
import { DeclaredProgramOrganizationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramOrganizationFormField/DeclaredProgramOrganizationFormField.stub'
import { DeclaredProgramPeriodFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramPeriodFormField/DeclaredProgramPeriodFormField.stub'
import { DeclaredProgramResultFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramResultFormField/DeclaredProgramResultFormField.stub'
import { DeclaredProgramSourceOfInformationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramSourceOfInformationFormField/DeclaredProgramSourceOfInformationFormField.stub'
import { DeclaredProgramTitleFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramTitleFormField/DeclaredProgramTitleFormField.stub'
import DeclaredProgramUpdateForm from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/components/DeclaredProgramUpdateForm/DeclaredProgramUpdateForm.vue'
import { AvCancelConfirmButtonsStub, AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockHandleSubmit = vi.fn()
const mockIsFormValid = ref(true)
const mockIsSubmitting = ref(false)
const mockState = ref({ isDirty: false })

vi.mock(
  '@/features/student/personalCareer/views/DeclaredProgramUpdateView/components/use-update-declared-program-form/use-update-declared-program-form',
  () => ({
    useUpdateDeclaredProgramForm: () => ({
      form: {
        handleSubmit: mockHandleSubmit,
        useStore: () => mockState,
      },
      isFormValid: mockIsFormValid,
      isSubmitting: mockIsSubmitting,
    }),
  })
)

BddTest().given('a declared program update form component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramUpdateForm>>

  const onCancel = vi.fn()
  const onProgramUpdated = vi.fn()

  const mockedDeclaredProgramDetailed = declaredProgramViewDTOFixture as unknown as DeclaredProgramDetailedDTO

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mockHandleSubmit.mockReset()
    mockIsFormValid.value = true
    mockIsSubmitting.value = false
    mockState.value = { isDirty: false }

    wrapper = mountComponent(DeclaredProgramUpdateForm, {
      props: {
        declaredProgramDetailed: mockedDeclaredProgramDetailed,
        onCancel,
        onProgramUpdated,
      },
      global: {
        stubs: {
          AvCard: AvCardStub,
          AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
          DeclaredProgramTitleFormField: DeclaredProgramTitleFormFieldStub,
          DeclaredProgramDescriptionFormField: DeclaredProgramDescriptionFormFieldStub,
          DeclaredProgramOrganizationFormField: DeclaredProgramOrganizationFormFieldStub,
          DeclaredProgramPeriodFormField: DeclaredProgramPeriodFormFieldStub,
          DeclaredProgramResultFormField: DeclaredProgramResultFormFieldStub,
          DeclaredProgramSourceOfInformationFormField: DeclaredProgramSourceOfInformationFormFieldStub,
        },
      },
      useI18n: true,
      usePinia: true,
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render all form field components', () => {
      expect(wrapper.findComponent(DeclaredProgramTitleFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredProgramOrganizationFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredProgramPeriodFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredProgramResultFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredProgramSourceOfInformationFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredProgramDescriptionFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render footer buttons with expected labels', () => {
      const buttons = getCancelConfirmButtons()
      expect(buttons.exists()).toBe(true)
      expect(buttons.props('cancelLabel')).toBe('Annuler')
      expect(buttons.props('confirmLabel')).toBe('Enregistrer')
    })
  })

  BddTest().when('form validity/submission state changes', () => {
    BddTest().then('it should set confirmDisabled=true when form is invalid', async () => {
      mockIsFormValid.value = false
      await flushPromises()

      const buttons = getCancelConfirmButtons()
      expect(buttons.exists()).toBe(true)
      expect(buttons.props('confirmDisabled')).toBe(true)
    })

    BddTest().then('it should set confirmIsLoading and cancelIsLoading when submitting', async () => {
      mockIsSubmitting.value = true
      await flushPromises()

      const buttons = getCancelConfirmButtons()
      expect(buttons.exists()).toBe(true)
      expect(buttons.props('confirmIsLoading')).toBe(true)
    })

    BddTest().then('it should set confirmIsLoading=true when submitting', async () => {
      mockIsSubmitting.value = true
      await flushPromises()

      const buttons = getCancelConfirmButtons()
      expect(buttons.exists()).toBe(true)
      expect(buttons.props('confirmIsLoading')).toBe(true)
    })

    BddTest().then('it should set confirmIsLoading=false when form is valid and not submitting', async () => {
      mockIsFormValid.value = true
      mockIsSubmitting.value = false
      await flushPromises()

      const buttons = getCancelConfirmButtons()
      expect(buttons.exists()).toBe(true)
      expect(buttons.props('confirmDisabled')).toBe(false)
    })
  })

  BddTest().when('the form store emits state changes', () => {
    BddTest().then('it should emit dirtyChange immediately', async () => {
      await flushPromises()
      const events = wrapper.emitted('dirtyChange')
      expect(events).toBeTruthy()
      expect(events?.length).toBeGreaterThanOrEqual(1)
      expect(events?.[0]?.[0]).toBe(false)
    })

    BddTest().then('it should emit dirtyChange when isDirty changes', async () => {
      await flushPromises()
      mockState.value = { isDirty: true }
      await flushPromises()

      const events = wrapper.emitted('dirtyChange')
      expect(events).toBeTruthy()
      expect(events?.some(e => e[0] === true)).toBe(true)
    })
  })

  BddTest().when('clicking on cancel', () => {
    BddTest().then('it should call onCancel prop', async () => {
      const buttons = getCancelConfirmButtons()
      await buttons.vm.$emit('cancel')
      expect(onCancel).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('clicking on confirm', () => {
    BddTest().then('it should call form.handleSubmit', async () => {
      const buttons = getCancelConfirmButtons()
      await buttons.vm.$emit('confirm')
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
    })
  })
})
