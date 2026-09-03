import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { declaredExperienceViewDTOFixture } from '@/__mocks__/fixtures/student/declaredExperiences.fixtures'
import { CreationUpdateDateDetailsStub } from '@/common/components/CreationUpdateDateDetails/CreationUpdateDateDetails.stub'
import { KitValorizationToggleFormFieldStub } from '@/features/student/global/components/interaction/formFields/KitValorizationToggleFormField/KitValorizationToggleFormField.stub'
import { DeclaredExperienceActivitySectorFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceActivitySectorFormField/DeclaredExperienceActivitySectorFormField.stub'
import { DeclaredExperienceDescriptionFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceDescriptionFormField/DeclaredExperienceDescriptionFormField.stub'
import { DeclaredExperienceExternalLinkFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceExternalLinkFormField/DeclaredExperienceExternalLinkFormField.stub'
import { DeclaredExperienceLocationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceLocationFormField/DeclaredExperienceLocationFormField.stub'
import { DeclaredExperienceOrganizationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceOrganizationFormField/DeclaredExperienceOrganizationFormField.stub'
import { DeclaredExperiencePeriodFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperiencePeriodFormField/DeclaredExperiencePeriodFormField.stub'
import { DeclaredExperienceResultFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceResultFormField/DeclaredExperienceResultFormField.stub'
import { DeclaredExperienceSourceOfInformationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSourceOfInformationFormField/DeclaredExperienceSourceOfInformationFormField.stub'
import { DeclaredExperienceSummaryFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSummaryFormField/DeclaredExperienceSummaryFormField.stub'
import { DeclaredExperienceTitleFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTitleFormField/DeclaredExperienceTitleFormField.stub'
import { DeclaredExperienceTypeFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTypeFormField/DeclaredExperienceTypeFormField.stub'
import UpdateDeclaredExperienceForm from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/UpdateDeclaredExperienceForm.vue'
import { AvCancelConfirmButtonsStub, AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockHandleSubmit = vi.fn()
const mockIsFormValid = ref(true)
const mockIsSubmitting = ref(false)
const mockState = ref({ isDirty: false })

vi.mock(
  '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/use-update-declared-experience-form/use-update-declared-experience-form',
  () => ({
    useUpdateDeclaredExperienceForm: () => ({
      form: {
        handleSubmit: mockHandleSubmit,
        useStore: () => mockState,
      },
      isFormValid: mockIsFormValid,
      isSubmitting: mockIsSubmitting,
    }),
  })
)

BddTest().given('a declared experience update form component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateDeclaredExperienceForm>>

  const onCancel = vi.fn()
  const onExperienceUpdated = vi.fn()

  const mockedDeclaredExperience = declaredExperienceViewDTOFixture as unknown as DeclaredExperienceViewDTO

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mockHandleSubmit.mockReset()
    mockIsFormValid.value = true
    mockIsSubmitting.value = false
    mockState.value = { isDirty: false }

    wrapper = mountComponent(UpdateDeclaredExperienceForm, {
      props: {
        declaredExperience: mockedDeclaredExperience,
        onExperienceUpdated,
        onCancel,
      },
      global: {
        stubs: {
          AvCard: AvCardStub,
          AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
          KitValorizationToggleFormField: KitValorizationToggleFormFieldStub,
          DeclaredExperienceTitleFormField: DeclaredExperienceTitleFormFieldStub,
          DeclaredExperienceTypeFormField: DeclaredExperienceTypeFormFieldStub,
          DeclaredExperienceOrganizationFormField: DeclaredExperienceOrganizationFormFieldStub,
          DeclaredExperienceLocationFormField: DeclaredExperienceLocationFormFieldStub,
          DeclaredExperienceResultFormField: DeclaredExperienceResultFormFieldStub,
          DeclaredExperienceActivitySectorFormField: DeclaredExperienceActivitySectorFormFieldStub,
          DeclaredExperiencePeriodFormField: DeclaredExperiencePeriodFormFieldStub,
          DeclaredExperienceSourceOfInformationFormField: DeclaredExperienceSourceOfInformationFormFieldStub,
          DeclaredExperienceExternalLinkFormField: DeclaredExperienceExternalLinkFormFieldStub,
          DeclaredExperienceDescriptionFormField: DeclaredExperienceDescriptionFormFieldStub,
          DeclaredExperienceSummaryFormField: DeclaredExperienceSummaryFormFieldStub,
          CreationUpdateDateDetails: CreationUpdateDateDetailsStub,
        },
      },
      useI18n: true,
      usePinia: true,
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render all form field components', () => {
      expect(wrapper.findComponent(KitValorizationToggleFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperienceTitleFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperienceTypeFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperienceOrganizationFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperienceLocationFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperienceResultFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperienceActivitySectorFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperiencePeriodFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperienceSourceOfInformationFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperienceExternalLinkFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperienceDescriptionFormFieldStub).exists()).toBe(true)
      expect(wrapper.findComponent(DeclaredExperienceSummaryFormFieldStub).exists()).toBe(true)
    })

    BddTest().then('it should render footer buttons with expected labels', () => {
      const buttons = getCancelConfirmButtons()
      expect(buttons.exists()).toBe(true)
      expect(buttons.props('cancelLabel')).toBe('Annuler')
      expect(buttons.props('confirmLabel')).toBe('Enregistrer')
    })

    BddTest().then('it should enable confirm button when form is valid', () => {
      const buttons = getCancelConfirmButtons()
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
  })

  BddTest().when('clicking on cancel', () => {
    BddTest().then('it should call onCancel prop', async () => {
      const buttons = getCancelConfirmButtons()
      await buttons.vm.$emit('cancel')
      expect(onCancel).toHaveBeenCalledTimes(1)
    })
  })
})
