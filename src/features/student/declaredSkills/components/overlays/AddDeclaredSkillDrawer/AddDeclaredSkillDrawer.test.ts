import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components'
import { AddDeclaredSkillDrawer } from '@/features/student/declaredSkills'
import {
  DeclaredSkillLevelRadioButtonSetFormFieldStub,
} from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillLevelRadioButtonSetFormField/DeclaredSkillLevelRadioButtonSetFormField.stub'
import { useDeclaredSkillsStore } from '@/features/student/declaredSkills/stores/declaredSkills.store'
import { AvButtonStub, AvCancelConfirmButtonsStub, AvDrawerStub, AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

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
  DeclaredSkillLevelRadioButtonSetFormField: DeclaredSkillLevelRadioButtonSetFormFieldStub
}

BddTest().given('an add declared skill drawer component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddDeclaredSkillDrawer>>

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)
  const getSaveButton = () => getCancelConfirmButtons()?.find('.confirm')
  const getCancelButton = () => getCancelConfirmButtons()?.find('.cancel')

  beforeEach(() => {
    vi.clearAllMocks()

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
      expect(title.text()).toBe('Ajouter une compétence complémentaire')
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
      const levelField = wrapper.findComponent({ name: 'DeclaredSkillLevelFormField' })

      expect(autocompleteField.exists()).toBe(true)
      expect(levelField.exists()).toBe(true)
    })

    BddTest().then('it should pass form to field components', () => {
      const autocompleteField = wrapper.findComponent({ name: 'AddDeclaredSkillAutocompleteField' })
      const levelField = wrapper.findComponent({ name: 'DeclaredSkillLevelFormField' })

      expect(autocompleteField.props('form')).toBeDefined()
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

  BddTest().when('the escape key is pressed on drawer', () => {
    BddTest().then('it should hide the declared skill drawer', async () => {
      const store = useDeclaredSkillsStore()
      const hideDrawerSpy = vi.spyOn(store, 'hideCreateDeclaredSkillDrawer')
      const drawer = wrapper.findComponent({ name: 'AvDrawer' })

      await drawer.vm.$emit('escape-pressed')

      expect(hideDrawerSpy).toHaveBeenCalled()
    })
  })

  BddTest().when('the cancel button is clicked', () => {
    BddTest().then('it should hide the drawer and reset form', async () => {
      const store = useDeclaredSkillsStore()
      const hideDrawerSpy = vi.spyOn(store, 'hideCreateDeclaredSkillDrawer')
      const cancelButton = getCancelButton()

      await cancelButton?.trigger('click')

      expect(hideDrawerSpy).toHaveBeenCalled()
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
})
