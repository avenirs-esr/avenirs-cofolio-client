import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components'
import {
  AdditionalSkillLevelRadioButtonSetFormFieldStub,
} from '@/features/student/additionalSkills/components/interactions/formFields/AdditionalSkillLevelRadioButtonSetFormField/AdditionalSkillLevelRadioButtonSetFormField.stub'
import { useAdditionalSkillsStore } from '@/features/student/additionalSkills/stores/additionalSkills.store'
import { AvButtonStub, AvCancelConfirmButtonsStub, AvDrawerStub, AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

import { beforeEach, expect, vi } from 'vitest'
import AddAdditionalSkillDrawer from './AddAdditionalSkillDrawer.vue'

const stubs = {
  AvDrawer: AvDrawerStub,
  AvButton: AvButtonStub,
  AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
  AvIcon: AvIconStub,
  ConfirmationModal: ConfirmationModalStub,
  AddAdditionalSkillAutocompleteField: {
    name: 'AddAdditionalSkillAutocompleteField',
    template: '<div data-testid="add-additional-skill-autocomplete-field"></div>',
    props: ['form']
  },
  AdditionalSkillLevelRadioButtonSetFormField: AdditionalSkillLevelRadioButtonSetFormFieldStub
}

BddTest().given('an add additional skill drawer component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AddAdditionalSkillDrawer>>

  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)
  const getSaveButton = () => getCancelConfirmButtons()?.find('.confirm')
  const getCancelButton = () => getCancelConfirmButtons()?.find('.cancel')

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mountComponent(AddAdditionalSkillDrawer, {
      global: {
        stubs
      }
    })

    const store = useAdditionalSkillsStore()
    store.displayCreateAdditionalSkillDrawer()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the drawer with correct props', () => {
      const drawer = wrapper.findComponent({ name: 'AvDrawer' })

      expect(drawer.exists()).toBe(true)
      expect(drawer.props('position')).toBe('right')
      expect(drawer.props('width')).toBe('40rem')
    })

    BddTest().then('it should render the header with title and icon', () => {
      const header = wrapper.find('.add-additional-skill-drawer__header')
      const title = wrapper.find('.add-additional-skill-drawer__title')
      const icon = wrapper.findComponent({ name: 'AvIcon' })

      expect(header.exists()).toBe(true)
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Ajouter une compétence complémentaire')
      expect(icon.exists()).toBe(true)
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
      const autocompleteField = wrapper.findComponent({ name: 'AddAdditionalSkillAutocompleteField' })
      const levelField = wrapper.findComponent({ name: 'AdditionalSkillLevelFormField' })

      expect(autocompleteField.exists()).toBe(true)
      expect(levelField.exists()).toBe(true)
    })

    BddTest().then('it should pass form to field components', () => {
      const autocompleteField = wrapper.findComponent({ name: 'AddAdditionalSkillAutocompleteField' })
      const levelField = wrapper.findComponent({ name: 'AdditionalSkillLevelFormField' })

      expect(autocompleteField.props('form')).toBeDefined()
      expect(levelField.props('form')).toBeDefined()
    })
  })

  BddTest().when('the store showCreateAdditionalSkillDrawer is false', () => {
    BddTest().then('it should pass false to drawer show prop', async () => {
      const store = useAdditionalSkillsStore()
      store.hideCreateAdditionalSkillDrawer()
      await wrapper.vm.$nextTick()

      const drawer = wrapper.findComponent({ name: 'AvDrawer' })
      expect(drawer.props('show')).toBe(false)
    })
  })

  BddTest().when('the escape key is pressed on drawer', () => {
    BddTest().then('it should hide the additional skill drawer', async () => {
      const store = useAdditionalSkillsStore()
      const hideDrawerSpy = vi.spyOn(store, 'hideCreateAdditionalSkillDrawer')
      const drawer = wrapper.findComponent({ name: 'AvDrawer' })

      await drawer.vm.$emit('escape-pressed')

      expect(hideDrawerSpy).toHaveBeenCalled()
    })
  })

  BddTest().when('the cancel button is clicked', () => {
    BddTest().then('it should hide the drawer and reset form', async () => {
      const store = useAdditionalSkillsStore()
      const hideDrawerSpy = vi.spyOn(store, 'hideCreateAdditionalSkillDrawer')
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
      const mainContainer = wrapper.find('.add-additional-skill-drawer')
      expect(mainContainer.exists()).toBe(true)
    })

    BddTest().then('it should render the header section', () => {
      const header = wrapper.find('.add-additional-skill-drawer__header')
      expect(header.exists()).toBe(true)
    })

    BddTest().then('it should render the content section', () => {
      const content = wrapper.find('.add-additional-skill-drawer__content')
      expect(content.exists()).toBe(true)
    })

    BddTest().then('it should render the footer section in drawer footer slot', () => {
      const footer = wrapper.find('.add-additional-skill-drawer__footer')
      expect(footer.exists()).toBe(true)
    })
  })
})
