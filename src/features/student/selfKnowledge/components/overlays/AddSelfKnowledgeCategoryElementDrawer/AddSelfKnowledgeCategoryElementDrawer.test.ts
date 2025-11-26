import { ESelfKnowledgeCategoryType, type SelfKnowledgeCategoryDTO } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components'
import { CategoryElementDescriptionTextareaFormFieldStub } from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementDescriptionTextareaFormField/CategoryElementDescriptionTextareaFormField.stub'
import { CategoryElementRatingRadioButtonSetFormFieldStub } from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementRatingRadioButtonSetFormField/CategoryElementRatingRadioButtonSetFormField.stub'
import { CategoryElementTitleInputFormFieldStub } from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementTitleInputFormField/CategoryElementTitleInputFormField.stub'
import AddSelfKnowledgeCategoryElementDrawer from '@/features/student/selfKnowledge/components/overlays/AddSelfKnowledgeCategoryElementDrawer/AddSelfKnowledgeCategoryElementDrawer.vue'
import { useSelfKnowledgeStore } from '@/features/student/selfKnowledge/stores/self-knowledge.store'
import { AvAccordionStub, AvButtonStub, AvCancelConfirmButtonsStub, AvDrawerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    }))
  }
})

BddTest().given('an add self knowledge category element drawer component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof AddSelfKnowledgeCategoryElementDrawer>>

  const mockCategory: SelfKnowledgeCategoryDTO = {
    id: 'category-123',
    title: 'Mes compétences',
    description: 'Category description',
    type: ESelfKnowledgeCategoryType.STRENGTHS
  }

  const stubs = {
    AvDrawer: AvDrawerStub,
    AvAccordion: AvAccordionStub,
    AvButton: AvButtonStub,
    ConfirmationModal: ConfirmationModalStub,
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
    CategoryElementTitleInputFormField: CategoryElementTitleInputFormFieldStub,
    CategoryElementDescriptionTextareaFormField: CategoryElementDescriptionTextareaFormFieldStub,
    CategoryElementRatingRadioButtonSetFormField: CategoryElementRatingRadioButtonSetFormFieldStub
  }

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)

  beforeEach(async () => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    const store = useSelfKnowledgeStore()
    store.openAddElementDrawer(mockCategory)

    wrapper = mountComponent<typeof AddSelfKnowledgeCategoryElementDrawer>(
      AddSelfKnowledgeCategoryElementDrawer,
      {
        global: {
          stubs
        }
      },
      {
        usePinia: false
      }
    )

    await wrapper.vm.$nextTick()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the drawer with correct props', () => {
      const drawer = wrapper.findComponent({ name: 'AvDrawer' })

      expect(drawer.exists()).toBe(true)
      expect(drawer.props('position')).toBe('right')
      expect(drawer.props('width')).toBe('50rem')
    })

    BddTest().then('it should render the title with category name', () => {
      const title = wrapper.find('h2')

      expect(title.exists()).toBe(true)
      expect(title.text()).toContain('Point fort')
    })

    BddTest().then('it should render accordion group with three accordions', () => {
      const accordionsGroup = wrapper.findComponent({ name: 'AvAccordionsGroup' })
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })

      expect(accordionsGroup.exists()).toBe(true)
      expect(accordions).toHaveLength(3)
    })

    BddTest().then('it should render the form fields in first accordion', () => {
      const titleField = wrapper.findComponent({ name: 'CategoryElementTitleInputFormField' })
      const descriptionField = wrapper.findComponent({ name: 'CategoryElementDescriptionTextareaFormField' })

      expect(titleField.exists()).toBe(true)
      expect(descriptionField.exists()).toBe(true)
    })

    BddTest().then('it should render the rating field in second accordion', () => {
      const ratingField = wrapper.findComponent({ name: 'CategoryElementRatingRadioButtonSetFormField' })

      expect(ratingField.exists()).toBe(true)
    })

    BddTest().then('it should render footer buttons', () => {
      const cancelConfirmButtons = getCancelConfirmButtons()

      expect(cancelConfirmButtons.exists()).toBe(true)
      expect(cancelConfirmButtons.props('cancelLabel')).toBe('Quitter')
      expect(cancelConfirmButtons.props('confirmLabel')).toBe('Enregistrer')
    })

    BddTest().then('it should render form element', () => {
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)
    })
  })

  BddTest().when('store showAddElementDrawer is false', () => {
    BddTest().then('it should pass false to drawer show prop', async () => {
      const store = useSelfKnowledgeStore()
      store.closeAddElementDrawer()
      await wrapper.vm.$nextTick()

      const drawer = wrapper.findComponent({ name: 'AvDrawer' })
      expect(drawer.props('show')).toBe(false)
    })
  })

  BddTest().when('escape is pressed on drawer', () => {
    BddTest().then('it should closeAddElementDrawer when form is not dirty', async () => {
      const store = useSelfKnowledgeStore()
      const hideDrawerSpy = vi.spyOn(store, 'closeAddElementDrawer')
      const drawer = wrapper.findComponent({ name: 'AvDrawer' })

      await drawer.vm.$emit('escape-pressed')

      expect(hideDrawerSpy).toHaveBeenCalled()
    })
  })

  BddTest().when('cancel button is clicked', () => {
    BddTest().then('it should closeAddElementDrawer when form is not dirty', async () => {
      const store = useSelfKnowledgeStore()
      const hideDrawerSpy = vi.spyOn(store, 'closeAddElementDrawer')

      const cancelConfirmButtons = getCancelConfirmButtons()
      await cancelConfirmButtons.vm.$emit('cancel')

      expect(hideDrawerSpy).toHaveBeenCalled()
    })
  })

  BddTest().when('save button state', () => {
    BddTest().then('it should be disabled initially when form is invalid', async () => {
      const cancelConfirmButtons = getCancelConfirmButtons()

      expect(cancelConfirmButtons.props('confirmDisabled')).toBe(false)
    })
  })

  BddTest().when('component has accordion items', () => {
    BddTest().then('it should render definition accordion with correct title', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const definitionAccordion = accordions[0]

      expect(definitionAccordion.props('title')).toBe('Ajouter mon élément')
      expect(definitionAccordion.props('icon')).toBeDefined()
    })

    BddTest().then('it should render rating accordion with correct title', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const ratingAccordion = accordions[1]

      expect(ratingAccordion.props('title')).toBe('Préciser mon élément')
    })

    BddTest().then('it should render associate accordion with correct title', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const associateAccordion = accordions[2]

      expect(associateAccordion.props('title')).toBe('Associer mon élément')
    })
  })

  BddTest().when('confirmation modal interactions', () => {
    BddTest().then('it should have confirmation modal rendered', () => {
      const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
      expect(confirmationModal.exists()).toBe(true)
    })
  })

  BddTest().when('different category types are selected', () => {
    BddTest().then('it should display correct category type in title', async () => {
      const store = useSelfKnowledgeStore()
      const interestCategory: SelfKnowledgeCategoryDTO = {
        id: 'category-456',
        title: 'Mes centres d\'intérêt',
        description: 'Interest category',
        type: ESelfKnowledgeCategoryType.INTERESTS
      }

      store.openAddElementDrawer(interestCategory)
      await wrapper.vm.$nextTick()

      const title = wrapper.find('h2')
      expect(title.text()).toContain('Centre d\'intérêt')
    })
  })
})
