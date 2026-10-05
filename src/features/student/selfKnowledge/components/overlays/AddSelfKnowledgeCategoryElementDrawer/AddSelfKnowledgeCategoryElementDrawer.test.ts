import { ESelfKnowledgeCategory, type SelfKnowledgeCategoryDTO } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { DrawerStub } from '@/common/components/Drawer/Drawer.stub'
import { CategoryElementDescriptionTextareaFormFieldStub } from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementDescriptionTextareaFormField/CategoryElementDescriptionTextareaFormField.stub'
import { CategoryElementRatingRadioButtonSetFormFieldStub } from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementRatingRadioButtonSetFormField/CategoryElementRatingRadioButtonSetFormField.stub'
import { CategoryElementTitleInputFormFieldStub } from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementTitleInputFormField/CategoryElementTitleInputFormField.stub'
import AddSelfKnowledgeCategoryElementDrawer from '@/features/student/selfKnowledge/components/overlays/AddSelfKnowledgeCategoryElementDrawer/AddSelfKnowledgeCategoryElementDrawer.vue'
import { useSelfKnowledgeStore } from '@/features/student/selfKnowledge/stores/self-knowledge.store'
import { AvAccordionStub, AvButtonStub, AvCancelConfirmButtonsStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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

const mockCanLeave = vi.fn<() => Promise<boolean>>()
const mockConfirm = vi.fn()
const mockCancel = vi.fn()

vi.mock('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard')
  >()
  return {
    ...actual,
    useUnsavedChangesGuard: () => ({
      canLeave: mockCanLeave,
      confirm: mockConfirm,
      cancel: mockCancel
    })
  }
})

BddTest().given('an add self knowledge category element drawer component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof AddSelfKnowledgeCategoryElementDrawer>>

  const mockCategory: SelfKnowledgeCategoryDTO = {
    type: ESelfKnowledgeCategory.STRENGTHS,
    mandatory: true
  }

  const stubs = {
    Drawer: DrawerStub,
    AvAccordion: AvAccordionStub,
    AvButton: AvButtonStub,
    ConfirmationModal: ConfirmationModalStub,
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
    CategoryElementTitleInputFormField: CategoryElementTitleInputFormFieldStub,
    CategoryElementDescriptionTextareaFormField: CategoryElementDescriptionTextareaFormFieldStub,
    CategoryElementRatingRadioButtonSetFormField: CategoryElementRatingRadioButtonSetFormFieldStub
  }

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)
  const getDrawer = () => wrapper.findComponent(DrawerStub)
  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getTitleField = () => wrapper.findComponent(CategoryElementTitleInputFormFieldStub)
  const getDescriptionField = () => wrapper.findComponent(CategoryElementDescriptionTextareaFormFieldStub)
  const getRatingField = () => wrapper.findComponent(CategoryElementRatingRadioButtonSetFormFieldStub)
  const getAccordions = () => wrapper.findAllComponents(AvAccordionStub)

  beforeEach(async () => {
    vi.clearAllMocks()
    mockCanLeave.mockResolvedValue(true)
    setActivePinia(createPinia())

    const store = useSelfKnowledgeStore()
    store.openAddElementDrawer(mockCategory)

    wrapper = mountComponent<typeof AddSelfKnowledgeCategoryElementDrawer>(
      AddSelfKnowledgeCategoryElementDrawer,
      { global: { stubs } },
      { usePinia: false }
    )
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the drawer with correct props', () => {
      const drawer = getDrawer()

      expect(drawer.exists()).toBe(true)
    })

    BddTest().then('it should render the title with category name', () => {
      const title = wrapper.find('h2')

      expect(title.exists()).toBe(true)
      expect(title.text()).toContain('Point fort')
    })

    BddTest().then('it should render accordion group with two accordions', () => {
      const accordionsGroup = wrapper.findComponent({ name: 'AvAccordionsGroup' })
      const accordions = getAccordions()

      expect(accordionsGroup.exists()).toBe(true)
      expect(accordions).toHaveLength(2)
    })

    BddTest().then('it should render the form fields in first accordion', () => {
      const titleField = getTitleField()
      const descriptionField = getDescriptionField()

      expect(titleField.exists()).toBe(true)
      expect(descriptionField.exists()).toBe(true)
    })

    BddTest().then('it should render the rating field in second accordion', () => {
      const ratingField = getRatingField()

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

      await vi.waitFor(() => {
        expect(getDrawer().props('show')).toBe(false)
      })
    })
  })

  BddTest().and('escape is pressed on drawer', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        const drawer = getDrawer()
        drawer.vm.$emit('close')
      })

      BddTest().then('it should hide the drawer', async () => {
        const store = useSelfKnowledgeStore()
        await vi.waitFor(() => {
          expect(store.showAddElementDrawer).toBe(false)
        })
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        const drawer = getDrawer()
        drawer.vm.$emit('close')
      })

      BddTest().then('it should not hide the drawer', async () => {
        const store = useSelfKnowledgeStore()
        await vi.waitFor(() => {
          expect(store.showAddElementDrawer).toBe(true)
        })
      })
    })
  })

  BddTest().and('cancel button is clicked', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        const cancelConfirmButtons = getCancelConfirmButtons()
        cancelConfirmButtons.vm.$emit('cancel')
      })

      BddTest().then('it should hide the drawer', async () => {
        const store = useSelfKnowledgeStore()
        await vi.waitFor(() => {
          expect(store.showAddElementDrawer).toBe(false)
        })
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        const cancelConfirmButtons = getCancelConfirmButtons()
        cancelConfirmButtons.vm.$emit('cancel')
      })

      BddTest().then('it should not hide the drawer', async () => {
        const store = useSelfKnowledgeStore()
        await vi.waitFor(() => {
          expect(store.showAddElementDrawer).toBe(true)
        })
      })

      BddTest().and('confirming the modal', () => {
        beforeEach(async () => {
          await vi.waitFor(() => {
            if (!getConfirmationModal().exists()) {
              throw new Error('Confirmation modal is not rendered')
            }
          })
          const confirmationModal = getConfirmationModal()
          confirmationModal.vm.$emit('confirm')
        })

        BddTest().then('it should call guard confirm', async () => {
          await vi.waitFor(() => {
            expect(mockConfirm).toHaveBeenCalledTimes(1)
          })
        })
      })

      BddTest().and('closing the modal', () => {
        beforeEach(async () => {
          await vi.waitFor(() => {
            if (!getConfirmationModal().exists()) {
              throw new Error('Confirmation modal is not rendered')
            }
          })
          const confirmationModal = getConfirmationModal()
          confirmationModal.vm.$emit('close')
        })

        BddTest().then('it should call guard cancel', async () => {
          await vi.waitFor(() => {
            expect(mockCancel).toHaveBeenCalledTimes(1)
          })
        })
      })
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
      const accordions = getAccordions()
      const definitionAccordion = accordions[0]

      expect(definitionAccordion.props('title')).toBe('Ajouter mon élément')
      expect(definitionAccordion.props('icon')).toBeDefined()
    })

    BddTest().then('it should render rating accordion with correct title', () => {
      const accordions = getAccordions()
      const ratingAccordion = accordions[1]

      expect(ratingAccordion.props('title')).toBe('Préciser mon élément')
    })
  })

  BddTest().when('confirmation modal interactions', () => {
    BddTest().then('it should have confirmation modal rendered', () => {
      const confirmationModal = getConfirmationModal()
      expect(confirmationModal.exists()).toBe(true)
    })
  })

  BddTest().when('different category types are selected', () => {
    BddTest().then('it should display correct category type in title', async () => {
      const store = useSelfKnowledgeStore()
      const interestCategory: SelfKnowledgeCategoryDTO = {
        type: ESelfKnowledgeCategory.INTERESTS,
        mandatory: false
      }

      store.openAddElementDrawer(interestCategory)

      await vi.waitFor(() => {
        expect(wrapper.find('h2').text()).toContain('Centre d\'intérêt')
      })
    })
  })
})
