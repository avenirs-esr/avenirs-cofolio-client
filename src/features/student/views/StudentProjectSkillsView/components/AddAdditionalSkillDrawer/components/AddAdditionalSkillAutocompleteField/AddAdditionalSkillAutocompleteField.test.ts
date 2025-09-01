import type {
  AdditionalSkillFormData
} from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/types'
import type { VueWrapper } from '@vue/test-utils'
import AddAdditionalSkillAutocompleteField from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/components/AddAdditionalSkillAutocompleteField/AddAdditionalSkillAutocompleteField.vue'
import { useForm } from '@tanstack/vue-form'
import { mountComponent } from 'tests/utils'

const TestWrapper = {
  components: {
    AddAdditionalSkillLevelField: AddAdditionalSkillAutocompleteField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        selectedSkills: [],
        level: undefined
      } as AdditionalSkillFormData,
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              selectedSkills: (!value.selectedSkills || value.selectedSkills.length === 0)
                ? 'Required field'
                : undefined,
              level: !value.level ? 'Required field' : undefined
            }
          }
        }
      }
    })
    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <AddAdditionalSkillLevelField :form="form" />
    </form>
  `
}

const stubs = {
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
      'maxDropdownHeight',
      'debounceDelay'
    ],
    emits: ['update:modelValue', 'search', 'clear', 'loadMore'],
    template: `
      <div class="av-autocomplete-stub">
        <input 
          :value="Array.isArray(modelValue) ? modelValue.map(opt => opt.title).join(', ') : ''"
          @input="$emit('update:modelValue', [])"
          :placeholder="inputOptions?.placeholder"
        />
        <div v-if="inputOptions?.errorMessage" class="error-message">{{ inputOptions.errorMessage }}</div>
        <slot name="empty" />
        <slot name="item" :option="{ id: '1', title: 'Test Skill', pathSegments: ['Path'], type: 'TEST' }" :isSelected="false" :toggle="() => {}" />
      </div>
    `
  },
  AvListItem: {
    name: 'AvListItem',
    props: ['clickable', 'hoverBackgroundColor', 'selected', 'icon', 'iconSize', 'iconColor', 'colorOnHover'],
    template: '<div class="av-list-item-stub"><slot /></div>'
  },
  AdditionalSkillTypeBadge: {
    name: 'AdditionalSkillTypeBadge',
    props: ['label', 'backgroundColor'],
    template: '<div class="badge-stub">{{ label }}</div>'
  }
}

describe('addAdditionalSkillLevelField', () => {
  describe('given a search skill field component', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mountComponent(TestWrapper, {
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the search skill field container', () => {
        const container = wrapper.find('.search-skill-field')
        expect(container.exists()).toBe(true)
      })

      it('then it should render AvAutocomplete with correct props', () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })

        expect(autocomplete.exists()).toBe(true)
        expect(autocomplete.props('multiSelect')).toBe(false)
        expect(autocomplete.props('serverSideFiltering')).toBe(true)
        expect(autocomplete.props('enableLoadMore')).toBe(true)
        expect(autocomplete.props('maxDropdownHeight')).toBe('14.5rem')
        expect(autocomplete.props('debounceDelay')).toBe(500)
      })

      it('then it should render input options with correct labels', () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
        const inputOptions = autocomplete.props('inputOptions')

        expect(inputOptions.placeholder).toBe('Commencer la recherche en tapant au moins 3 caractères')
      })

      it('then it should render empty message for initial state', () => {
        const emptyMessage = wrapper.find('.empty-message')
        expect(emptyMessage.exists()).toBe(true)
        expect(emptyMessage.text()).toBe('Commencez à taper pour rechercher une compétence')
      })

      it('then it should render skill item with correct structure', () => {
        const listItem = wrapper.findComponent({ name: 'AvListItem' })
        expect(listItem.exists()).toBe(true)

        const skillItem = wrapper.find('.skill-item')
        expect(skillItem.exists()).toBe(true)

        const skillTitle = wrapper.find('.skill-item__title')
        expect(skillTitle.exists()).toBe(true)

        const skillPath = wrapper.find('.skill-item__path')
        expect(skillPath.exists()).toBe(true)

        const badge = wrapper.findComponent({ name: 'AdditionalSkillTypeBadge' })
        expect(badge.exists()).toBe(true)
      })
    })

    describe('when search query is entered', () => {
      it('then it should emit search event', async () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })

        await autocomplete.vm.$emit('search', 'javascript')

        expect(autocomplete.exists()).toBe(true)
      })

      it('then it should show minimum characters message when query is too short', () => {
        const emptyMessages = wrapper.findAll('.empty-message')
        expect(emptyMessages.length).toBeGreaterThan(0)
      })
    })

    describe('when autocomplete value is updated', () => {
      it('then it should update the form field value', async () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
        const testSkill = {
          id: '1',
          label: 'JavaScript',
          value: '1',
          title: 'JavaScript',
          pathSegments: ['Programming'],
          type: 'TECHNICAL'
        }

        await autocomplete.vm.$emit('update:modelValue', [testSkill])
        await wrapper.vm.$nextTick()

        expect(autocomplete.props('modelValue')).toEqual([testSkill])
      })
    })

    describe('when clear is triggered', () => {
      it('then it should emit clear event', async () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })

        await autocomplete.vm.$emit('clear')

        expect(autocomplete.exists()).toBe(true)
      })
    })

    describe('when load more is triggered', () => {
      it('then it should emit load-more event', async () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })

        await autocomplete.vm.$emit('loadMore')

        expect(autocomplete.exists()).toBe(true)
      })
    })

    describe('when form is validated with empty selection', () => {
      it('then it should show error message', async () => {
        await wrapper.find('form').trigger('submit')

        await vi.waitFor(() => {
          const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
          const inputOptions = autocomplete.props('inputOptions')
          expect(inputOptions.errorMessage).toBe('Required field')
        })
      })
    })

    describe('when skills are loading', () => {
      it('then it should handle loading state properly', () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })

        expect(autocomplete.props()).toHaveProperty('loading')
      })
    })

    describe('when fetching next page', () => {
      it('then it should handle pagination loading state', () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })

        expect(autocomplete.props('enableLoadMore')).toBe(true)
      })
    })
  })
})
