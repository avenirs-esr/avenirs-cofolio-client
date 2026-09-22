import type { AssociationSelections } from '@/features/student/associations'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { AssociationSelectionSectionStub } from '@/features/student/associations/components/sections/AssociationSelectionSection/AssociationSelectionSection.stub'
import { AddDeclaredSkillDrawer } from '@/features/student/declaredSkills'
import {
  DeclaredSkillLevelRadioButtonSetFormFieldStub,
} from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillLevelRadioButtonSetFormField/DeclaredSkillLevelRadioButtonSetFormField.stub'
import { useDeclaredSkillsStore } from '@/features/student/declaredSkills/stores/declaredSkills.store'
import { AvButtonStub, AvCancelConfirmButtonsStub, AvDrawerStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: false,
    })
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

const stubs = {
  AvDrawer: AvDrawerStub,
  AvButton: AvButtonStub,
  AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
  AvIconText: AvIconTextStub,
  ConfirmationModal: ConfirmationModalStub,
  AddDeclaredSkillAutocompleteField: {
    name: 'AddDeclaredSkillAutocompleteField',
    template: '<div data-testid="add-declared-skill-autocomplete-field"></div>',
    props: ['form']
  },
  DeclaredSkillLevelRadioButtonSetFormField: DeclaredSkillLevelRadioButtonSetFormFieldStub,
  AssociationSelectionSection: AssociationSelectionSectionStub,
}

BddTest().given('an add declared skill drawer component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddDeclaredSkillDrawer>>

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)
  const getSaveButton = () => getCancelConfirmButtons()?.find('.confirm')
  const getCancelButton = () => getCancelConfirmButtons()?.find('.cancel')
  const getAssociationSelectionSection = () => wrapper.findComponent(AssociationSelectionSectionStub)
  const getAccordionsGroup = () => wrapper.findComponent({ name: 'AvAccordionsGroup' })
  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getAvDrawer = () => wrapper.findComponent(AvDrawerStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mockCanLeave.mockResolvedValue(true)

    wrapper = mountComponent(AddDeclaredSkillDrawer, {
      global: {
        stubs
      }
    })

    const store = useDeclaredSkillsStore()
    store.displayCreateDeclaredSkillDrawer()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the drawer with correct props', () => {
      const drawer = getAvDrawer()

      expect(drawer.exists()).toBe(true)
      expect(drawer.props('show')).toBe(true)
      expect(drawer.props('position')).toBe('right')
      expect(drawer.props('width')).toBe('40rem')
    })

    BddTest().then('it should render the header with title and icon', () => {
      const header = wrapper.find('[data-testid="add-declared-skill-drawer__header"]')
      const title = wrapper.findComponent(AvIconTextStub)

      expect(header.exists()).toBe(true)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe('Ajouter une compétence déclarée')
    })

    BddTest().then('it should render footer buttons', () => {
      const cancelConfirmButtons = getCancelConfirmButtons()
      expect(cancelConfirmButtons.exists()).toBe(true)

      const cancelButton = getCancelButton()
      const saveButton = getSaveButton()

      expect(cancelButton?.text()).toBe('Annuler')
      expect(saveButton?.text()).toBe('Enregistrer')
    })

    BddTest().then('it should render form element', () => {
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)
    })

    BddTest().then('it should render the field components', () => {
      const autocompleteField = wrapper.findComponent({ name: 'AddDeclaredSkillAutocompleteField' })
      const reflectionField = wrapper.findComponent({ name: 'DeclaredSkillReflectionFormField' })
      const levelField = wrapper.findComponent({ name: 'DeclaredSkillLevelFormField' })

      expect(autocompleteField.exists()).toBe(true)
      expect(reflectionField.exists()).toBe(true)
      expect(levelField.exists()).toBe(true)
    })

    BddTest().then('it should pass form to field components', () => {
      const autocompleteField = wrapper.findComponent({ name: 'AddDeclaredSkillAutocompleteField' })
      const reflectionField = wrapper.findComponent({ name: 'DeclaredSkillReflectionFormField' })
      const levelField = wrapper.findComponent({ name: 'DeclaredSkillLevelFormField' })

      expect(autocompleteField.props('form')).toBeDefined()
      expect(reflectionField.props('form')).toBeDefined()
      expect(levelField.props('form')).toBeDefined()
    })
  })

  BddTest().when('the store showCreateDeclaredSkillDrawer is false', () => {
    BddTest().then('it should pass false to drawer show prop', async () => {
      const store = useDeclaredSkillsStore()
      store.hideCreateDeclaredSkillDrawer()
      await wrapper.vm.$nextTick()

      const drawer = getAvDrawer()
      expect(drawer.props('show')).toBe(false)
    })
  })

  BddTest().when('escape is pressed on drawer', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        const drawer = getAvDrawer()
        await drawer.vm.$emit('escape-pressed')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hide the declared skill drawer', () => {
        const store = useDeclaredSkillsStore()
        expect(store.showCreateDeclaredSkillDrawer).toBe(false)
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        const drawer = getAvDrawer()
        await drawer.vm.$emit('escape-pressed')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should not hide the declared skill drawer', () => {
        const store = useDeclaredSkillsStore()
        expect(store.showCreateDeclaredSkillDrawer).toBe(true)
      })
    })
  })

  BddTest().when('cancel button is clicked', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        const cancelButton = getCancelButton()
        await cancelButton?.trigger('click')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hide the declared skill drawer', () => {
        const store = useDeclaredSkillsStore()
        expect(store.showCreateDeclaredSkillDrawer).toBe(false)
      })
    })

    BddTest().and('canLeave is false', () => {
      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(false)
        const cancelButton = getCancelButton()
        await cancelButton?.trigger('click')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should not hide the declared skill drawer', () => {
        const store = useDeclaredSkillsStore()
        expect(store.showCreateDeclaredSkillDrawer).toBe(true)
      })

      BddTest().and('confirming the modal', () => {
        beforeEach(async () => {
          const confirmationModal = getConfirmationModal()
          await confirmationModal.vm.$emit('confirm')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call guard confirm', () => {
          expect(mockConfirm).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('closing the modal', () => {
        beforeEach(async () => {
          const confirmationModal = getConfirmationModal()
          await confirmationModal.vm.$emit('close')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call guard cancel', () => {
          expect(mockCancel).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  BddTest().when('the confirmation modal is displayed', () => {
    BddTest().then('it should be initially hidden', () => {
      const confirmationModal = getConfirmationModal()

      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('opened')).toBe(false)
    })
  })

  BddTest().when('the button states are checked', () => {
    BddTest().then('it should have disabled prop bound to form state on confirm button', () => {
      const cancelConfirmButtons = getCancelConfirmButtons()
      expect(cancelConfirmButtons?.props('confirmDisabled')).toBeDefined()
    })

    BddTest().then('it should have isLoading prop bound to submission state on confirm button', () => {
      const cancelConfirmButtons = getCancelConfirmButtons()
      expect(cancelConfirmButtons?.props('confirmIsLoading')).toBeDefined()
    })

    BddTest().then('it should have disabled prop bound to submission state on cancel button', () => {
      const cancelConfirmButtons = getCancelConfirmButtons()
      expect(cancelConfirmButtons?.props('cancelDisabled')).toBeDefined()
    })
  })

  BddTest().when('the drawer layout is checked', () => {
    BddTest().then('it should render the main content container', () => {
      const mainContainer = wrapper.find('[data-testid="add-declared-skill-drawer"]')
      expect(mainContainer.exists()).toBe(true)
    })

    BddTest().then('it should render the header section', () => {
      const header = wrapper.find('[data-testid="add-declared-skill-drawer__header"]')
      expect(header.exists()).toBe(true)
    })

    BddTest().then('it should render the content section', () => {
      const content = wrapper.find('[data-testid="add-declared-skill-drawer__content"]')
      expect(content.exists()).toBe(true)
    })

    BddTest().then('it should render the footer section in drawer footer slot', () => {
      const footer = wrapper.find('[data-testid="add-declared-skill-drawer__footer"]')
      expect(footer.exists()).toBe(true)
    })
  })

  BddTest().when('the association selection section is rendered', () => {
    BddTest().then('it should render the association selection section in the associations accordion', () => {
      const associationsAccordion = wrapper.findAllComponents({ name: 'AvAccordion' })[2]

      expect(associationsAccordion.findComponent(AssociationSelectionSectionStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the declared skill context type', () => {
      expect(getAssociationSelectionSection().props('contextType')).toBe(EAssociationContextType.DECLARED_SKILL)
    })

    BddTest().then('it should not restrict the associated context types', () => {
      expect(getAssociationSelectionSection().props('associatedContextTypes')).toBeUndefined()
    })

    BddTest().then('it should pass the vertical layout', () => {
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
      await getAccordionsGroup().vm.$emit('update:activeAccordion', 2)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should enable the search of the association selection section', () => {
      expect(getAssociationSelectionSection().props('enabled')).toBe(true)
    })

    BddTest().and('another accordion is activated', () => {
      beforeEach(async () => {
        await getAccordionsGroup().vm.$emit('update:activeAccordion', 1)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should disable the search of the association selection section', () => {
        expect(getAssociationSelectionSection().props('enabled')).toBe(false)
      })
    })

    BddTest().and('every accordion is collapsed', () => {
      beforeEach(async () => {
        await getAccordionsGroup().vm.$emit('update:activeAccordion', undefined)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should disable the search of the association selection section', () => {
        expect(getAssociationSelectionSection().props('enabled')).toBe(false)
      })
    })
  })

  BddTest().when('the association selection section emits a selections update', () => {
    const selections: AssociationSelections = {
      [EAssociationContextType.DECLARED_ACTIVITY]: [{ id: 'activity-1', title: 'Activity 1' }],
      [EAssociationContextType.TRACE]: [{ id: 'trace-1', title: 'Trace 1' }]
    }

    beforeEach(async () => {
      await getAssociationSelectionSection().vm.$emit('update:selections', selections)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the association selections of the form', () => {
      expect(getAssociationSelectionSection().props('selections')).toStrictEqual(selections)
    })

    BddTest().and('the drawer is cancelled', () => {
      beforeEach(async () => {
        await getCancelButton()?.trigger('click')
        await flushPromises()
      })

      BddTest().then('it should reset the association selections of the form', () => {
        expect(getAssociationSelectionSection().props('selections')).toStrictEqual({})
      })
    })
  })

  BddTest().when('component has accordion items', () => {
    BddTest().then('it should render the associations accordion with correct title', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const associationsAccordion = accordions[2]

      expect(associationsAccordion.props('title')).toBe('Associer ma compétence')
    })
  })
})
