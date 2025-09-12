import type { VueWrapper } from '@vue/test-utils'
import { EAdditionalSkillType } from '@/api/avenir-esr'
import { useSkillsStore } from '@/store'
import { mountComponent } from 'tests/utils'
import AddAdditionalSkillDrawer from './AddAdditionalSkillDrawer.vue'

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

const stubs = {
  AvDrawer: {
    name: 'AvDrawer',
    props: ['show', 'position', 'width'],
    emits: ['escape-pressed'],
    template: '<div class="av-drawer-stub"><slot /><slot name="footer" /></div>'
  },
  AvAutocomplete: {
    name: 'AvAutocomplete',
    props: [
      'modelValue',
      'options',
      'loading',
      'inputOptions',
      'getOptionLabel',
      'getOptionKey',
      'multiSelect',
      'serverSideFiltering',
      'enableLoadMore',
      'maxDropdownHeight'
    ],
    emits: ['update:modelValue', 'search', 'clear', 'loadMore'],
    template: '<div class="av-autocomplete-stub"><slot name="item" v-for="option in options" :key="option.id" :option="option" :is-selected="false" :toggle="() => {}" /></div>'
  },
  AvButton: {
    name: 'AvButton',
    props: ['label', 'variant', 'type', 'disabled', 'loading'],
    emits: ['click'],
    template: '<button :disabled="disabled" @click="$emit(\'click\')">{{ label }}</button>'
  },
  AvListItem: {
    name: 'AvListItem',
    props: ['clickable', 'hoverBackgroundColor', 'selected', 'icon', 'iconSize', 'iconColor', 'colorOnHover'],
    emits: ['click'],
    template: '<div class="av-list-item-stub" @click="$emit(\'click\')"><slot /></div>'
  },
  AdditionalSkillTypeBadge: {
    name: 'AdditionalSkillTypeBadge',
    props: ['label', 'backgroundColor'],
    template: '<div class="additional-skill-type-badge-stub">{{ label }}</div>'
  },
  AddAdditionalSkillConfirmationModal: {
    name: 'AddAdditionalSkillConfirmationModal',
    props: ['id', 'show'],
    emits: ['cancel', 'confirm'],
    template: '<div class="add-additional-skill-confirmation-modal-stub" />'
  },
  VIcon: {
    name: 'VIcon',
    props: ['name', 'size', 'color'],
    template: '<div class="v-icon-stub"></div>'
  }
}

describe('addAdditionalSkillDrawer', () => {
  describe('given an add additional skill drawer component', () => {
    let wrapper: VueWrapper<InstanceType<typeof AddAdditionalSkillDrawer>>

    const createMockSkill = () => ([{
      id: '1',
      label: 'Test Skill',
      value: '1',
      title: 'Test Skill',
      pathSegments: ['Test'],
      type: EAdditionalSkillType.ROME4
    }])

    const getSaveButton = () => {
      return wrapper.findAllComponents({ name: 'AvButton' }).find(button =>
        button.props('variant') === 'FLAT'
      )
    }

    const getCancelButton = () => {
      return wrapper.findAllComponents({ name: 'AvButton' }).find(button =>
        button.props('variant') === 'OUTLINED'
      )
    }

    const setupFormWithMockSkill = async () => {
      const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
      const mockSkill = createMockSkill()
      await autocomplete.vm.$emit('update:modelValue', mockSkill)
      await wrapper.vm.$nextTick()
      return { autocomplete, mockSkill }
    }

    const triggerCancelAndGetModal = async () => {
      const cancelButton = getCancelButton()
      await cancelButton?.vm.$emit('click')
      await wrapper.vm.$nextTick()
      return wrapper.findComponent({ name: 'AddAdditionalSkillConfirmationModal' })
    }

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mountComponent(AddAdditionalSkillDrawer, {
        global: {
          stubs
        },
        useTanstack: true,
        usePinia: true
      })

      const store = useSkillsStore()
      store.displayCreateAdditionalSkillDrawer()
    })

    describe('when the component is mounted', () => {
      it('then it should render the drawer with correct props', () => {
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })

        expect(drawer.exists()).toBe(true)
        expect(drawer.props('position')).toBe('right')
        expect(drawer.props('width')).toBe('40rem')
      })

      it('then it should render the header with title and icon', () => {
        const header = wrapper.find('.add-additional-skill-drawer__header')
        const title = wrapper.find('.add-additional-skill-drawer__title')
        const icon = wrapper.findComponent({ name: 'VIcon' })

        expect(header.exists()).toBe(true)
        expect(title.exists()).toBe(true)
        expect(title.text()).toBe('Ajouter une compétence complémentaire')
        expect(icon.exists()).toBe(true)
      })

      it('then it should render the autocomplete with correct props', () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })

        expect(autocomplete.exists()).toBe(true)
        expect(autocomplete.props('multiSelect')).toBe(false)
        expect(autocomplete.props('serverSideFiltering')).toBe(true)
        expect(autocomplete.props('enableLoadMore')).toBe(true)
        expect(autocomplete.props('maxDropdownHeight')).toBe('14.5rem')
      })

      it('then it should render footer buttons', () => {
        const buttons = wrapper.findAllComponents({ name: 'AvButton' })
        const cancelButton = getCancelButton()
        const saveButton = getSaveButton()

        expect(buttons).toHaveLength(2)
        expect(cancelButton?.props('label')).toBe('Annuler')
        expect(saveButton?.props('label')).toBe('Enregistrer')
      })

      it('then it should render form element', () => {
        const form = wrapper.find('form')
        expect(form.exists()).toBe(true)
      })

      it('then it should render autocomplete with empty options initially', () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
        const options = autocomplete.props('options')

        expect(options).toHaveLength(0)
      })
    })

    describe('when the store showCreateAdditionalSkillDrawer is false', () => {
      it('then it should pass false to drawer show prop', async () => {
        const store = useSkillsStore()
        store.hideCreateAdditionalSkillDrawer()
        await wrapper.vm.$nextTick()

        const drawer = wrapper.findComponent({ name: 'AvDrawer' })
        expect(drawer.props('show')).toBe(false)
      })
    })

    describe('when the escape key is pressed on drawer', () => {
      it('then it should hide the additional skill drawer', async () => {
        const store = useSkillsStore()
        const hideDrawerSpy = vi.spyOn(store, 'hideCreateAdditionalSkillDrawer')
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })

        await drawer.vm.$emit('escape-pressed')

        expect(hideDrawerSpy).toHaveBeenCalled()
      })
    })

    describe('when the cancel button is clicked', () => {
      it('then it should hide the drawer and reset form', async () => {
        const store = useSkillsStore()
        const hideDrawerSpy = vi.spyOn(store, 'hideCreateAdditionalSkillDrawer')
        const cancelButton = getCancelButton()

        await cancelButton?.vm.$emit('click')

        expect(hideDrawerSpy).toHaveBeenCalled()
      })
    })

    describe('when the save button is clicked', () => {
      it('then it should show loading state during form submission', async () => {
        await setupFormWithMockSkill()

        const saveButton = getSaveButton()
        expect(saveButton?.props('loading')).toBe(false)

        const form = wrapper.find('form')
        await form.trigger('submit')

        await vi.waitFor(() => {
          expect(saveButton?.props('loading')).toBe(true)
        },)

        expect(saveButton?.props('disabled')).toBe(true)

        await vi.waitFor(() => {
          expect(saveButton?.props('loading')).toBe(false)
        },)
      })

      it('then it should show success message when skill is added', async () => {
        await setupFormWithMockSkill()

        const saveButton = getSaveButton()
        await saveButton?.vm.$emit('click')

        await vi.waitFor(() => {
          expect(mockAddSuccessMessage).toHaveBeenCalledWith({
            timeout: 2000,
            description: 'Compétence ajoutée avec succès'
          })
        })
      })
    })

    describe('when option functions are configured', () => {
      it('then it should have proper autocomplete configuration', () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
        expect(autocomplete.props('getOptionLabel')).toBeDefined()
        expect(autocomplete.props('getOptionKey')).toBeDefined()
      })
    })

    describe('when the form is dirty and cancel is clicked', () => {
      it('then it should show confirmation modal when form has changes', async () => {
        await setupFormWithMockSkill()

        const confirmationModal = await triggerCancelAndGetModal()
        expect(confirmationModal.props('show')).toBe(true)
      })

      it('then it should hide drawer when confirmation modal confirm is triggered', async () => {
        const store = useSkillsStore()
        const hideDrawerSpy = vi.spyOn(store, 'hideCreateAdditionalSkillDrawer')

        await setupFormWithMockSkill()
        const confirmationModal = await triggerCancelAndGetModal()
        await confirmationModal.vm.$emit('confirm')

        expect(hideDrawerSpy).toHaveBeenCalled()
      })

      it('then it should hide confirmation modal when cancel is triggered', async () => {
        await setupFormWithMockSkill()
        const confirmationModal = await triggerCancelAndGetModal()
        await confirmationModal.vm.$emit('cancel')

        expect(confirmationModal.props('show')).toBe(false)
      })
    })

    describe('when save button state changes based on form state', () => {
      it('then it should be enabled initially before validation', () => {
        const saveButton = getSaveButton()
        expect(saveButton?.props('disabled')).toBe(false)
      })

      it('then it should remain enabled when form has valid data', async () => {
        await setupFormWithMockSkill()

        const saveButton = getSaveButton()
        expect(saveButton?.props('disabled')).toBe(false)
      })

      it('then it should show loading state as false initially', () => {
        const saveButton = getSaveButton()
        expect(saveButton?.props('loading')).toBe(false)
      })
    })

    describe('when additional skill field components are rendered', () => {
      it('then it should render form field components', () => {
        const formContent = wrapper.find('.add-additional-skill-drawer__content')
        expect(formContent.exists()).toBe(true)

        const form = wrapper.find('form')
        expect(form.exists()).toBe(true)
      })
    })
  })
})
