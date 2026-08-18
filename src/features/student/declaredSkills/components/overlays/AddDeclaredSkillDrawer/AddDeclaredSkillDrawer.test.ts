import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { AddDeclaredSkillDrawer } from '@/features/student/declaredSkills'
import {
  DeclaredSkillLevelRadioButtonSetFormFieldStub,
} from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillLevelRadioButtonSetFormField/DeclaredSkillLevelRadioButtonSetFormField.stub'
import { useDeclaredSkillsStore } from '@/features/student/declaredSkills/stores/declaredSkills.store'
import { EAssociationTypeKey } from '@/features/student/traces/types/traces.types'
import { AssociateElementsDrawerSectionStub } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/AssociateElementsDrawerSection/AssociateElementsDrawerSection.stub'
import { AvButtonStub, AvCancelConfirmButtonsStub, AvDrawerStub, AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
  AvIcon: AvIconStub,
  ConfirmationModal: ConfirmationModalStub,
  AddDeclaredSkillAutocompleteField: {
    name: 'AddDeclaredSkillAutocompleteField',
    template: '<div data-testid="add-declared-skill-autocomplete-field"></div>',
    props: ['form']
  },
  DeclaredSkillLevelRadioButtonSetFormField: DeclaredSkillLevelRadioButtonSetFormFieldStub,
  AssociateElementsDrawerSection: AssociateElementsDrawerSectionStub,
}

BddTest().given('an add declared skill drawer component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddDeclaredSkillDrawer>>

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)
  const getSaveButton = () => getCancelConfirmButtons()?.find('.confirm')
  const getCancelButton = () => getCancelConfirmButtons()?.find('.cancel')

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
      const drawer = wrapper.findComponent({ name: 'AvDrawer' })

      expect(drawer.exists()).toBe(true)
      expect(drawer.props('position')).toBe('right')
      expect(drawer.props('width')).toBe('40rem')
    })

    BddTest().then('it should render the header with title and icon', () => {
      const header = wrapper.find('[data-testid="add-declared-skill-drawer__header"]')
      const title = wrapper.findComponent({ name: 'AvIconText' })

      expect(header.exists()).toBe(true)
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Ajouter une compétence déclarée')
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

      const drawer = wrapper.findComponent({ name: 'AvDrawer' })
      expect(drawer.props('show')).toBe(false)
    })
  })

  BddTest().when('escape is pressed on drawer', () => {
    BddTest().and('canLeave is true', () => {
      beforeEach(async () => {
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })
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
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })
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
          const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
          await confirmationModal.vm.$emit('confirm')
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call guard confirm', () => {
          expect(mockConfirm).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('closing the modal', () => {
        beforeEach(async () => {
          const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })
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
      const confirmationModal = wrapper.findComponent({ name: 'ConfirmationModal' })

      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(false)
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

  BddTest().when('the associate elements section is rendered', () => {
    BddTest().then('it should render the associate elements drawer section in the last accordion', () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
      expect(section.exists()).toBe(true)
    })

    BddTest().then('it should pass typeConfigs for activities and declared experiences', () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
      const typeConfigs = section.props('typeConfigs') as { key: string }[]

      expect(typeConfigs).toHaveLength(2)
      expect(typeConfigs[0].key).toBe(EAssociationTypeKey.ACTIVITIES)
      expect(typeConfigs[1].key).toBe(EAssociationTypeKey.DECLARED_EXPERIENCES)
    })

    BddTest().then('it should default the active type key to activities', () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
      expect(section.props('activeTypeKey')).toBe(EAssociationTypeKey.ACTIVITIES)
    })
  })

  BddTest().when('the associate elements section emits a search query update', () => {
    BddTest().then('it should forward the search query back to the section', async () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)

      await section.vm.$emit('update:searchQuery', 'react')
      await wrapper.vm.$nextTick()

      expect(section.props('searchQuery')).toBe('react')
    })
  })

  BddTest().when('the associate elements section emits a selections update', () => {
    BddTest().then('it should update the associationSelections form field', async () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
      const newSelections = { [EAssociationTypeKey.ACTIVITIES]: ['activity-1'] }

      await section.vm.$emit('update:selectionsByType', newSelections)
      await wrapper.vm.$nextTick()

      expect(section.props('selectionsByType')).toStrictEqual(newSelections)
    })
  })

  BddTest().when('component has accordion items', () => {
    BddTest().then('it should render the associations accordion with correct title', () => {
      const accordions = wrapper.findAllComponents({ name: 'AvAccordion' })
      const associationsAccordion = accordions[2]

      expect(associationsAccordion.props('title')).toBe('Associer ma compétence')
    })
  })

  BddTest().when('the associate elements section emits a selections update with declared experiences', () => {
    BddTest().then('it should update the associationSelections form field', async () => {
      const section = wrapper.findComponent(AssociateElementsDrawerSectionStub)
      const newSelections = { [EAssociationTypeKey.DECLARED_EXPERIENCES]: ['experience-1'] }

      await section.vm.$emit('update:selectionsByType', newSelections)
      await wrapper.vm.$nextTick()

      expect(section.props('selectionsByType')).toStrictEqual(newSelections)
    })
  })
})
