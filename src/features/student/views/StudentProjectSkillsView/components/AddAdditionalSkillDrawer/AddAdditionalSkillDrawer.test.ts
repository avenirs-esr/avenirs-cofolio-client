import type { VueWrapper } from '@vue/test-utils'
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
    props: ['label', 'variant', 'type', 'disabled'],
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
  VIcon: {
    name: 'VIcon',
    props: ['name', 'size', 'color'],
    template: '<div class="v-icon-stub"></div>'
  }
}

describe('addAdditionalSkillDrawer', () => {
  describe('given an add additional skill drawer component', () => {
    let wrapper: VueWrapper<InstanceType<typeof AddAdditionalSkillDrawer>>

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
        expect(drawer.props('position')).toBe('left')
        expect(drawer.props('width')).toBe('50rem')
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

    describe('when store showCreateAdditionalSkillDrawer is false', () => {
      it('then it should pass false to drawer show prop', async () => {
        const store = useSkillsStore()
        store.hideCreateAdditionalSkillDrawer()
        await wrapper.vm.$nextTick()

        const drawer = wrapper.findComponent({ name: 'AvDrawer' })
        expect(drawer.props('show')).toBe(false)
      })
    })

    describe('when escape is pressed on drawer', () => {
      it('then it should hideCreateAdditionalSkillDrawer', async () => {
        const store = useSkillsStore()
        const hideDrawerSpy = vi.spyOn(store, 'hideCreateAdditionalSkillDrawer')
        const drawer = wrapper.findComponent({ name: 'AvDrawer' })

        await drawer.vm.$emit('escape-pressed')

        expect(hideDrawerSpy).toHaveBeenCalled()
      })
    })

    describe('when cancel button is clicked', () => {
      it('then it should hideCreateAdditionalSkillDrawer and reset form', async () => {
        const store = useSkillsStore()
        const hideDrawerSpy = vi.spyOn(store, 'hideCreateAdditionalSkillDrawer')
        const cancelButton = getCancelButton()

        await cancelButton?.vm.$emit('click')

        expect(hideDrawerSpy).toHaveBeenCalled()
      })
    })

    describe('when save button is clicked', () => {
      it('then it should be disabled initially when form is not valid', () => {
        const saveButton = getSaveButton()
        expect(saveButton?.props('disabled')).toBe(false)
      })

      it('then it should show success message when skill is added', async () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
        const mockSkill = {
          id: '1',
          label: 'Test Skill',
          value: '1',
          title: 'Test Skill',
          pathSegments: ['Test'],
          type: 'ROME 4.0'
        }

        await autocomplete.vm.$emit('update:modelValue', mockSkill)
        await wrapper.vm.$nextTick()

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

    describe('when search events are handled', () => {
      it('then it should handle search events', async () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })

        await autocomplete.vm.$emit('search', 'test search')
        await wrapper.vm.$nextTick()

        expect(autocomplete.emitted('search')).toBeTruthy()
      })

      it('then it should handle clear events', async () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })

        await autocomplete.vm.$emit('clear')
        await wrapper.vm.$nextTick()

        expect(autocomplete.emitted('clear')).toBeTruthy()
      })

      it('then it should handle load more events', async () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })

        await autocomplete.vm.$emit('loadMore')
        await wrapper.vm.$nextTick()

        expect(autocomplete.emitted('loadMore')).toBeTruthy()
      })
    })

    describe('when option functions are configured', () => {
      it('then it should have proper autocomplete configuration', () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
        expect(autocomplete.props('getOptionLabel')).toBeDefined()
        expect(autocomplete.props('getOptionKey')).toBeDefined()
      })
    })
  })
})
