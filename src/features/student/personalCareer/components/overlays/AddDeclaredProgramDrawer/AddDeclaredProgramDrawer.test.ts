import type { AssociationSelections } from '@/features/student/associations'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { AssociationSelectionSectionStub } from '@/features/student/associations/components/sections/AssociationSelectionSection/AssociationSelectionSection.stub'
import { DeclaredProgramDescriptionFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramDescriptionFormField/DeclaredProgramDescriptionFormField.stub'
import { DeclaredProgramOrganizationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramOrganizationFormField/DeclaredProgramOrganizationFormField.stub'
import { DeclaredProgramPeriodFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramPeriodFormField/DeclaredProgramPeriodFormField.stub'
import { DeclaredProgramResultFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramResultFormField/DeclaredProgramResultFormField.stub'
import { DeclaredProgramSourceOfInformationFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramSourceOfInformationFormField/DeclaredProgramSourceOfInformationFormField.stub'
import { DeclaredProgramTitleFormFieldStub } from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramTitleFormField/DeclaredProgramTitleFormField.stub'
import AddDeclaredProgramDrawer from '@/features/student/personalCareer/components/overlays/AddDeclaredProgramDrawer/AddDeclaredProgramDrawer.vue'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { AvAccordionsGroupStub, AvAccordionStub, AvCancelConfirmButtonsStub, AvDrawerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

enum AddDeclaredProgramDrawerAccordions {
  PROGRAM_DETAILS = 0,
  ADD_ASSOCIATIONS = 1
}

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

BddTest().given('an add declared program drawer component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof AddDeclaredProgramDrawer>>

  const FORM_FIELD_STUBS = [
    DeclaredProgramTitleFormFieldStub,
    DeclaredProgramDescriptionFormFieldStub,
    DeclaredProgramOrganizationFormFieldStub,
    DeclaredProgramPeriodFormFieldStub,
    DeclaredProgramResultFormFieldStub,
    DeclaredProgramSourceOfInformationFormFieldStub
  ]

  const stubs = {
    AvDrawer: AvDrawerStub,
    AvAccordion: AvAccordionStub,
    AvAccordionsGroup: AvAccordionsGroupStub,
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
    ConfirmationModal: ConfirmationModalStub,
    DeclaredProgramTitleFormField: DeclaredProgramTitleFormFieldStub,
    DeclaredProgramDescriptionFormField: DeclaredProgramDescriptionFormFieldStub,
    DeclaredProgramOrganizationFormField: DeclaredProgramOrganizationFormFieldStub,
    DeclaredProgramPeriodFormField: DeclaredProgramPeriodFormFieldStub,
    DeclaredProgramResultFormField: DeclaredProgramResultFormFieldStub,
    DeclaredProgramSourceOfInformationFormField: DeclaredProgramSourceOfInformationFormFieldStub,
    AssociationSelectionSection: AssociationSelectionSectionStub
  }

  const mountWith = async () => {
    wrapper = mountComponent<typeof AddDeclaredProgramDrawer>(
      AddDeclaredProgramDrawer,
      { global: { stubs } },
      { usePinia: false }
    )
    await wrapper.vm.$nextTick()
  }

  const getStore = () => usePersonalCareerStore()
  const getForm = () => wrapper.find('[data-testid="add-declared-program-form"]')
  const getAvDrawer = () => wrapper.findComponent(AvDrawerStub)
  const getAvAccordionsGroup = () => wrapper.findComponent(AvAccordionsGroupStub)
  const getAvAccordions = () => wrapper.findAllComponents(AvAccordionStub)
  const getAvAccordion = (accordion: AddDeclaredProgramDrawerAccordions) => getAvAccordions()[accordion]
  const getAssociationSelectionSection = () => wrapper.findComponent(AssociationSelectionSectionStub)
  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)
  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)

  const activateAccordion = async (accordion: AddDeclaredProgramDrawerAccordions) => {
    getAvAccordionsGroup().vm.$emit('update:activeAccordion', accordion)
    await flushPromises()
  }

  const collapseAccordions = async () => {
    getAvAccordionsGroup().vm.$emit('update:activeAccordion', undefined)
    await flushPromises()
  }

  const pressEscape = async () => {
    getAvDrawer().vm.$emit('escape-pressed')
    await flushPromises()
  }

  const clickCancel = async () => {
    getCancelConfirmButtons().vm.$emit('cancel')
    await flushPromises()
  }

  const confirmModal = async () => {
    getConfirmationModal().vm.$emit('confirm')
    await flushPromises()
  }

  const closeModal = async () => {
    getConfirmationModal().vm.$emit('close')
    await flushPromises()
  }

  const updateSelections = async (selections: AssociationSelections) => {
    getAssociationSelectionSection().vm.$emit('update:selections', selections)
    await flushPromises()
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockCanLeave.mockResolvedValue(true)
    setActivePinia(createPinia())
    getStore().displayAddDeclaredProgramDrawer()

    await mountWith()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the drawer with correct props', () => {
      const drawer = getAvDrawer()

      expect(drawer.exists()).toBe(true)
      expect(drawer.props('show')).toBe(true)
      expect(drawer.props('position')).toBe('right')
      expect(drawer.props('width')).toBe('40rem')
    })

    BddTest().then('it should render the title', () => {
      expect(wrapper.text()).toContain('Ajouter une formation déclarée')
    })

    BddTest().then('it should render accordion group with two accordions', () => {
      expect(getAvAccordionsGroup().exists()).toBe(true)
      expect(getAvAccordions()).toHaveLength(2)
    })

    BddTest().then('it should render all form fields in the program details accordion', () => {
      FORM_FIELD_STUBS.forEach((formFieldStub) => {
        expect(getAvAccordion(AddDeclaredProgramDrawerAccordions.PROGRAM_DETAILS).findComponent(formFieldStub).exists()).toBe(true)
      })
    })

    BddTest().then('it should render the program details accordion with correct title', () => {
      const programDetailsAccordion = getAvAccordion(AddDeclaredProgramDrawerAccordions.PROGRAM_DETAILS)

      expect(programDetailsAccordion.props('title')).toBe('Ajouter ma formation')
      expect(programDetailsAccordion.props('icon')).toBeDefined()
    })

    BddTest().then('it should render the associations accordion with correct title', () => {
      expect(getAvAccordion(AddDeclaredProgramDrawerAccordions.ADD_ASSOCIATIONS).props('title')).toBe('Associer ma formation')
    })

    BddTest().then('it should render footer buttons', () => {
      const cancelConfirmButtons = getCancelConfirmButtons()

      expect(cancelConfirmButtons.exists()).toBe(true)
      expect(cancelConfirmButtons.props('cancelLabel')).toBe('Annuler')
      expect(cancelConfirmButtons.props('confirmLabel')).toBe('Enregistrer')
    })

    BddTest().then('it should render form element', () => {
      expect(getForm().exists()).toBe(true)
    })

    BddTest().then('it should be disabled initially when form is invalid', () => {
      expect(getCancelConfirmButtons().props('confirmDisabled')).toBe(true)
    })

    BddTest().then('it should have confirmation modal rendered', () => {
      expect(getConfirmationModal().exists()).toBe(true)
    })

    BddTest().then('it should render the association selection section in the associations accordion', () => {
      const section = getAvAccordion(AddDeclaredProgramDrawerAccordions.ADD_ASSOCIATIONS).findComponent(AssociationSelectionSectionStub)

      expect(section.exists()).toBe(true)
      expect(section.attributes('data-testid')).toBe('associate-elements-section')
    })

    BddTest().then('it should pass the declared program context type', () => {
      expect(getAssociationSelectionSection().props('contextType')).toBe(EAssociationContextType.DECLARED_PROGRAM)
    })

    BddTest().then('it should not restrict the associated context types', () => {
      expect(getAssociationSelectionSection().props('associatedContextTypes')).toBeUndefined()
    })

    BddTest().then('it should render the association selection section in vertical layout', () => {
      expect(getAssociationSelectionSection().props('layout')).toBe('vertical')
    })

    BddTest().then('it should pass the empty association selections of the form', () => {
      expect(getAssociationSelectionSection().props('selections')).toStrictEqual({})
    })

    BddTest().then('it should not enable the search while the associations accordion is not active', () => {
      expect(getAssociationSelectionSection().props('enabled')).toBe(false)
    })
  })

  BddTest().when('the associations accordion is activated', () => {
    beforeEach(async () => {
      await activateAccordion(AddDeclaredProgramDrawerAccordions.ADD_ASSOCIATIONS)
    })

    BddTest().then('it should enable the search of the association selection section', () => {
      expect(getAssociationSelectionSection().props('enabled')).toBe(true)
    })

    BddTest().and('the program details accordion is activated', () => {
      beforeEach(async () => {
        await activateAccordion(AddDeclaredProgramDrawerAccordions.PROGRAM_DETAILS)
      })

      BddTest().then('it should disable the search of the association selection section', () => {
        expect(getAssociationSelectionSection().props('enabled')).toBe(false)
      })
    })

    BddTest().and('every accordion is collapsed', () => {
      beforeEach(async () => {
        await collapseAccordions()
      })

      BddTest().then('it should disable the search of the association selection section', () => {
        expect(getAssociationSelectionSection().props('enabled')).toBe(false)
      })
    })
  })

  BddTest().when('the association selection section emits a selections update', () => {
    const newSelections: AssociationSelections = {
      [EAssociationContextType.DECLARED_SKILL]: [{ id: 'skill-1', title: 'Skill 1' }],
      [EAssociationContextType.TRACE]: [{ id: 'trace-1', title: 'Trace 1' }]
    }

    beforeEach(async () => {
      await updateSelections(newSelections)
    })

    BddTest().then('it should update the associationSelections form field', () => {
      expect(getAssociationSelectionSection().props('selections')).toStrictEqual(newSelections)
    })

    BddTest().and('the drawer is cancelled', () => {
      beforeEach(async () => {
        await clickCancel()
      })

      BddTest().then('it should reset the associationSelections form field', () => {
        expect(getAssociationSelectionSection().props('selections')).toStrictEqual({})
      })
    })
  })

  BddTest().when('store showAddDeclaredProgramDrawer is false', () => {
    beforeEach(async () => {
      getStore().hideAddDeclaredProgramDrawer()
      await flushPromises()
    })

    BddTest().then('it should pass false to drawer show prop', () => {
      expect(getAvDrawer().props('show')).toBe(false)
    })
  })

  BddTest().when('escape is pressed on drawer', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        await pressEscape()
      })

      BddTest().then('it should hide the drawer', () => {
        expect(getStore().showAddDeclaredProgramDrawer).toBe(false)
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        await pressEscape()
      })

      BddTest().then('it should not hide the drawer', () => {
        expect(getStore().showAddDeclaredProgramDrawer).toBe(true)
      })
    })
  })

  BddTest().when('cancel button is clicked', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        await clickCancel()
      })

      BddTest().then('it should hide the drawer', () => {
        expect(getStore().showAddDeclaredProgramDrawer).toBe(false)
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        await clickCancel()
      })

      BddTest().then('it should not hide the drawer', () => {
        expect(getStore().showAddDeclaredProgramDrawer).toBe(true)
      })

      BddTest().and('confirming the modal', () => {
        beforeEach(async () => {
          await confirmModal()
        })

        BddTest().then('it should call guard confirm', () => {
          expect(mockConfirm).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('closing the modal', () => {
        beforeEach(async () => {
          await closeModal()
        })

        BddTest().then('it should call guard cancel', () => {
          expect(mockCancel).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
