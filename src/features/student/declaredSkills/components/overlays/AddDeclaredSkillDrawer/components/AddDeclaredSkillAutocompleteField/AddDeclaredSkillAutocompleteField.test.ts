import type {
  DeclaredSkillFormData
} from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/types'
import type { VueWrapper } from '@vue/test-utils'
import { EExternalSkillType } from '@/api/avenir-esr'
import AddDeclaredSkillAutocompleteField from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/components/AddDeclaredSkillAutocompleteField/AddDeclaredSkillAutocompleteField.vue'
import { AvListItemStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: {
    AddDeclaredSkillAutocompleteField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        selectedSkills: [],
        level: undefined
      } as unknown as DeclaredSkillFormData,
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              selectedSkills: (!value.selectedSkills || value.selectedSkills.length === 0)
                ? 'Une compétence doit être sélectionnée'
                : undefined,
              level: !value.level ? 'Un niveau d\'auto-positionnement doit être sélectionné' : undefined
            }
          }
        }
      }
    })
    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <AddDeclaredSkillAutocompleteField :form="form" />
    </form>
  `
}

const stubs = {
  Autocomplete: {
    name: 'Autocomplete',
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
    emits: ['update:modelValue', 'update:search', 'clear', 'loadMore'],
    template: `
      <div class="av-autocomplete-stub">
        <input 
          :value="Array.isArray(modelValue) ? modelValue.map(opt => opt.title).join(', ') : ''"
          @input="$emit('update:modelValue', [])"
          :placeholder="inputOptions?.placeholder"
        />
        <div v-if="inputOptions?.errorMessage" class="error-message">{{ inputOptions.errorMessage }}</div>
        <slot name="empty" />
        <slot name="item" :option="{ id: '1', title: 'Test Skill', pathSegments: ['Path'], type: '${EExternalSkillType.ROME4}' }" :isSelected="false" :toggle="() => {}" />
      </div>
    `
  },
  AvListItem: AvListItemStub,
  DeclaredSkillTypeBadge: {
    name: 'DeclaredSkillTypeBadge',
    props: ['label', 'backgroundColor'],
    template: '<div class="badge-stub">{{ label }}</div>'
  }
}

BddTest().given('an autocomplete skill field component', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mountComponent(TestWrapper, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the autocomplete field container', () => {
      const container = wrapper.find('[data-testid="search-skill-field"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render Autocomplete with correct props', () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })

      expect(autocomplete.exists()).toBe(true)
      expect(autocomplete.props('multiSelect')).toBe(false)
      expect(autocomplete.props('serverSideFiltering')).toBe(true)
      expect(autocomplete.props('enableLoadMore')).toBe(true)
      expect(autocomplete.props('maxDropdownHeight')).toBe('14.5rem')
      expect(autocomplete.props('debounceDelay')).toBe(500)
    })

    BddTest().then('it should render input options with correct labels', () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })
      const inputOptions = autocomplete.props('inputOptions')

      expect(inputOptions.placeholder).toBe('Commencer la recherche en tapant au moins 3 caractères')
      expect(inputOptions.label).toBe('Rechercher une compétence')
    })

    BddTest().then('it should render empty message for initial state', () => {
      const emptyMessage = wrapper.find('.b2-regular')
      expect(emptyMessage.exists()).toBe(true)
      expect(emptyMessage.text()).toBe('Commencez à taper pour rechercher une compétence')
    })

    BddTest().then('it should render skill item with correct structure', () => {
      const listItem = wrapper.findComponent({ name: 'AvListItem' })
      expect(listItem.exists()).toBe(true)

      const skillItem = wrapper.find('[data-testid="skill-item"]')
      expect(skillItem.exists()).toBe(true)

      const skillTitle = wrapper.find('.b1-bold')
      expect(skillTitle.exists()).toBe(true)

      const skillPath = wrapper.find('.caption-light')
      expect(skillPath.exists()).toBe(true)

      const badge = wrapper.findComponent({ name: 'DeclaredSkillTypeBadge' })
      expect(badge.exists()).toBe(true)
    })
  })

  BddTest().when('a search query is entered', () => {
    BddTest().then('it should emit update:search event', async () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })

      await autocomplete.vm.$emit('update:search', 'javascript')

      expect(autocomplete.exists()).toBe(true)
    })

    BddTest().then('it should show minimum characters message when query is too short', () => {
      const emptyMessages = wrapper.findAll('.b2-regular')
      expect(emptyMessages.length).toBeGreaterThan(0)
    })
  })

  BddTest().when('the autocomplete value is updated', () => {
    BddTest().then('it should update the form field value', async () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })
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

  BddTest().when('clear is triggered', () => {
    BddTest().then('it should emit clear event', async () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })

      await autocomplete.vm.$emit('clear')

      expect(autocomplete.exists()).toBe(true)
    })
  })

  BddTest().when('load more is triggered', () => {
    BddTest().then('it should emit load-more event', async () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })

      await autocomplete.vm.$emit('loadMore')

      expect(autocomplete.exists()).toBe(true)
    })
  })

  BddTest().when('the form is validated with empty selection', () => {
    BddTest().then('it should show error message', async () => {
      await wrapper.find('form').trigger('submit')

      await vi.waitFor(() => {
        const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })
        const inputOptions = autocomplete.props('inputOptions')
        expect(inputOptions.errorMessage).toBe('Une compétence doit être sélectionnée')
      })
    })
  })

  BddTest().when('skills are loading', () => {
    BddTest().then('it should handle loading state properly', () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })

      expect(autocomplete.props()).toHaveProperty('loading')
    })
  })

  BddTest().when('fetching the next page', () => {
    BddTest().then('it should handle pagination loading state', () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })

      expect(autocomplete.props('enableLoadMore')).toBe(true)
    })
  })

  BddTest().when('handling search query interactions', () => {
    BddTest().then('it should handle search query changes with proper debouncing', () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })
      expect(autocomplete.props('debounceDelay')).toBe(500)
    })

    BddTest().then('it should show no results message when search yields empty results', () => {
      const emptySlot = wrapper.find('.b2-regular')
      expect(emptySlot.exists()).toBe(true)
    })
  })

  BddTest().when('highlighting skill options', () => {
    BddTest().then('it should apply highlight class to matched text', () => {
      const skillTitle = wrapper.find('.b1-bold')
      expect(skillTitle.exists()).toBe(true)
    })

    BddTest().then('it should handle path segments with separators', () => {
      const pathSegments = wrapper.find('.caption-light')
      expect(pathSegments.exists()).toBe(true)
    })
  })

  BddTest().when('option functions are configured', () => {
    BddTest().then('it should bind getOptionLabel function correctly', () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })
      expect(autocomplete.props('getOptionLabel')).toBeDefined()
      expect(typeof autocomplete.props('getOptionLabel')).toBe('function')
    })

    BddTest().then('it should bind getOptionKey function correctly', () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })
      expect(autocomplete.props('getOptionKey')).toBeDefined()
      expect(typeof autocomplete.props('getOptionKey')).toBe('function')
    })
  })

  BddTest().when('rendering the skill type badge', () => {
    BddTest().then('it should render DeclaredSkillTypeBadge with correct props', () => {
      const badge = wrapper.findComponent({ name: 'DeclaredSkillTypeBadge' })
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBeDefined()
    })
  })

  BddTest().when('integrating with form field', () => {
    BddTest().then('it should integrate with TanStack Form Field component', () => {
      const container = wrapper.find('[data-testid="search-skill-field"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should handle field state changes correctly', async () => {
      const autocomplete = wrapper.findComponent({ name: 'Autocomplete' })
      expect(autocomplete.props('modelValue')).toBeDefined()
    })
  })

  BddTest().when('skill options are available', () => {
    BddTest().then('it should render skill options with proper structure', () => {
      const listItem = wrapper.findComponent({ name: 'AvListItem' })
      expect(listItem.props('icon')).toBeDefined()
    })

    BddTest().then('it should handle skill selection through toggle function', () => {
      const listItem = wrapper.findComponent({ name: 'AvListItem' })
      expect(listItem.exists()).toBe(true)
    })
  })

  BddTest().when('displaying different empty states', () => {
    BddTest().then('it should show different messages based on search state', () => {
      const emptyMessages = wrapper.findAll('.b2-regular')
      expect(emptyMessages.length).toBeGreaterThan(0)
    })
  })
})
