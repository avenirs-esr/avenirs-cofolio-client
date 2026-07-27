import type {
  SelfKnowledgeElementDetailsDTO
} from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { CreationUpdateDateDetailsStub } from '@/common/components/CreationUpdateDateDetails/CreationUpdateDateDetails.stub'
import { KitValorizationToggleFormFieldStub } from '@/features/student/global/components/interaction/formFields/KitValorizationToggleFormField/KitValorizationToggleFormField.stub'
import { CategoryElementDescriptionTextareaFormFieldStub } from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementDescriptionTextareaFormField/CategoryElementDescriptionTextareaFormField.stub'
import { CategoryElementRatingRadioButtonSetFormFieldStub } from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementRatingRadioButtonSetFormField/CategoryElementRatingRadioButtonSetFormField.stub'
import { CategoryElementTitleInputFormFieldStub } from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementTitleInputFormField/CategoryElementTitleInputFormField.stub'
import SelfKnowledgeElementUpdateForm
  from '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/SelfKnowledgeElementUpdateForm.vue'
import { AvCancelConfirmButtonsStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentSelfKnowledgeCategory = vi.fn()

vi.mock('@/common/composables/use-navigation/use-navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/use-navigation/use-navigation')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentSelfKnowledgeCategory
    })
  }
})

const handleSubmitSpy = vi.fn()
const resetSpy = vi.fn()

vi.mock(
  '@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/use-update-self-knowledge-element-form/use-update-self-knowledge-element-form',
  async (importOriginal) => {
    const actual = await importOriginal<
      typeof import('@/features/student/selfKnowledge/views/SelfKnowledgeElementUpdateView/components/SelfKnowledgeElementUpdateForm/use-update-self-knowledge-element-form/use-update-self-knowledge-element-form')
    >()

    return {
      ...actual,
      useUpdateSelfKnowledgeElementForm: vi.fn(() => ({
        form: {
          handleSubmit: handleSubmitSpy,
          reset: resetSpy
        },
        isFormValid: ref(true),
        isSubmitting: ref(false)
      }))
    }
  }
)

BddTest().given('a self knowledge element update form component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof SelfKnowledgeElementUpdateForm>>

  const mockElement: SelfKnowledgeElementDetailsDTO = {
    id: 'element-123',
    title: 'My Strength',
    description: 'This is a detailed description',
    rating: 3,
    createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-02-01T10:00:00Z').toISOString()
  } as SelfKnowledgeElementDetailsDTO

  const stubs = {
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
    CategoryElementTitleInputFormField: CategoryElementTitleInputFormFieldStub,
    CategoryElementDescriptionTextareaFormField: CategoryElementDescriptionTextareaFormFieldStub,
    CategoryElementRatingRadioButtonSetFormField: CategoryElementRatingRadioButtonSetFormFieldStub,
    KitValorizationToggleFormField: KitValorizationToggleFormFieldStub,
    ConfirmationModal: ConfirmationModalStub,
    CreationUpdateDateDetails: CreationUpdateDateDetailsStub
  }

  const getCancelConfirmButtons = () =>
    wrapper.findComponent(AvCancelConfirmButtonsStub)

  const getConfirmationModal = () =>
    wrapper.findComponent(ConfirmationModalStub)

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mountComponent<typeof SelfKnowledgeElementUpdateForm>(
      SelfKnowledgeElementUpdateForm,
      {
        props: {
          element: mockElement,
          onCancel: vi.fn(),
        },
        global: {
          stubs
        }
      }
    )
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the form layout', () => {
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)

      const leftColumn = wrapper.find('.self-knowledge-element-update-form__left-column')
      const rightColumn = wrapper.find('.self-knowledge-element-update-form__right-column')

      expect(leftColumn.exists()).toBe(true)
      expect(rightColumn.exists()).toBe(true)
    })

    BddTest().then('it should render the form fields', () => {
      const titleField = wrapper.findComponent({ name: 'CategoryElementTitleInputFormField' })
      const descriptionField = wrapper.findComponent({ name: 'CategoryElementDescriptionTextareaFormField' })
      const ratingField = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSetFormField' })
      const valorizationField = wrapper.findComponent(KitValorizationToggleFormFieldStub)

      expect(titleField.exists()).toBe(true)
      expect(descriptionField.exists()).toBe(true)
      expect(ratingField.exists()).toBe(true)
      expect(valorizationField.exists()).toBe(true)
    })

    BddTest().then('it should render CreationUpdateDateDetails with correct props', () => {
      const details = wrapper.findComponent(CreationUpdateDateDetailsStub)

      expect(details.exists()).toBe(true)
      expect(details.props('createdAt')).toBe(mockElement.createdAt)
      expect(details.props('updatedAt')).toBe(mockElement.updatedAt)
      expect(details.props('createdAtPrefix')).toBeDefined()
    })

    BddTest().then('it should render footer buttons with correct labels and icons', () => {
      const buttons = getCancelConfirmButtons()

      expect(buttons.exists()).toBe(true)
      expect(buttons.props('cancelLabel')).toBe('Annuler')
      expect(buttons.props('confirmLabel')).toBe('Enregistrer les modifications')
      expect(buttons.props('confirmDisabled')).toBe(false)
      expect(buttons.props('confirmIsLoading')).toBe(false)
      expect(buttons.props('cancelIcon')).toBeDefined()
      expect(buttons.props('confirmIcon')).toBeDefined()
    })

    BddTest().then('it should render the confirmation modal', () => {
      const modal = getConfirmationModal()
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('title')).toBe('Êtes-vous certain(e) de vouloir abandonner les modifications de votre élément ?')
    })
  })

  BddTest().when('the save button is clicked', () => {
    BddTest().then('it should call form.handleSubmit', async () => {
      const buttons = getCancelConfirmButtons()

      await buttons.vm.$emit('confirm')

      expect(handleSubmitSpy).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('the cancel button is clicked', () => {
    BddTest().then('it should display the confirmation modal', async () => {
      const buttons = getCancelConfirmButtons()

      await buttons.vm.$emit('cancel')

      const modal = getConfirmationModal()
      expect(modal.props('show')).toBe(true)
    })
  })

  BddTest().when('the confirmation modal confirm event is emitted', () => {
    BddTest().then('it should reset the form and navigate back to category view', async () => {
      const modal = getConfirmationModal()

      await modal.vm.$emit('confirm')

      expect(resetSpy).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('the confirmation modal close event is emitted', () => {
    BddTest().then('it should hide the confirmation modal', async () => {
      const buttons = getCancelConfirmButtons()
      await buttons.vm.$emit('cancel')

      let modal = getConfirmationModal()
      expect(modal.props('show')).toBe(true)

      await modal.vm.$emit('close')

      modal = getConfirmationModal()
      expect(modal.props('show')).toBe(false)
    })
  })
})
