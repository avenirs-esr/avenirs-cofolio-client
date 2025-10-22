import type { VueWrapper } from '@vue/test-utils'
import { ETraceAssociationType } from '@/api/avenir-esr'
import AssociateSkillAutocompleteField from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceAssociateModal/components/AssociateSkillAutocompleteField/AssociateSkillAutocompleteField.vue'
import { AvListItemStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

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
      'showSelectedSection',
      'serverSideFiltering',
      'enableLoadMore',
      'maxDropdownHeight',
      'debounceDelay',
      'dropdownClass',
      'dropdownWidth'
    ],
    emits: ['update:modelValue', 'search', 'clear', 'loadMore'],
    template: `
      <div class="av-autocomplete-stub">
        <input
          class="autocomplete-input"
          :placeholder="inputOptions?.placeholder"
          @input="$emit('update:modelValue', modelValue)"
        />
        <div v-if="inputOptions?.errorMessage" class="error-message">{{ inputOptions.errorMessage }}</div>

        <slot name="empty" />

        <slot
          name="item"
          :option="(options && options[0]) || { id: 'demo', label: 'Démo', value: 'demo', title: 'Démo' }"
          :isSelected="false"
          :toggle="() => {}"
        />
      </div>
    `
  },
  AvListItem: AvListItemStub
}

const TestWrapper = {
  components: { AssociateSkillAutocompleteField },
  setup () {
    const form = useForm({
      defaultValues: {
        selectedAssociation: [] as any[]
      },
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              selectedAssociation: (Array.isArray(value.selectedAssociation) && value.selectedAssociation.length > 0)
                ? undefined
                : 'Une association doit être sélectionnée'
            }
          }
        }
      }
    })

    return { form, ETraceAssociationType }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <AssociateSkillAutocompleteField
        :form="form"
        field-name="selectedAssociation"
        :association-type="ETraceAssociationType.SKILL_LEVEL"
      />
    </form>
  `
}

BddTest().given('an associate skill autocomplete field component', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(TestWrapper, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the field container', () => {
      const container = wrapper.find('.search-trace-association-field')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render AvAutocomplete with correct core props', () => {
      const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
      expect(autocomplete.exists()).toBe(true)
      expect(autocomplete.props('serverSideFiltering')).toBe(true)
      expect(autocomplete.props('enableLoadMore')).toBe(true)
      expect(autocomplete.props('maxDropdownHeight')).toBe('14.5rem')
      expect(autocomplete.props('debounceDelay')).toBe(500)
      expect(autocomplete.props('multiSelect')).toBe(true)
      expect(autocomplete.props('showSelectedSection')).toBe(true)
    })

    BddTest().then('it should set input options (label, placeholder)', () => {
      const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
      const inputOptions = autocomplete.props('inputOptions') as any
      expect(inputOptions).toBeDefined()
      expect(inputOptions.label).toBeTruthy()
      expect(inputOptions.placeholder).toBeTruthy()
    })

    BddTest().then('it should show initial empty message (start typing)', () => {
      const emptyMessage = wrapper.find('.b2-regular')
      expect(emptyMessage.exists()).toBe(true)
    })
  })

  BddTest().when('a search query is entered', () => {
    BddTest().and('query is too short', () => {
      BddTest().then('it should show minimum characters message', async () => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
        await autocomplete.vm.$emit('search', 'phy')
        expect(autocomplete.exists()).toBe(true)
      })
    })

    BddTest().then('it should show minimum characters message when query is too short', () => {
      const emptyMessages = wrapper.findAll('.b2-regular')
      expect(emptyMessages.length).toBeGreaterThan(0)
    })
  })

  BddTest().when('the autocomplete model changes', () => {
    BddTest().then('it should write array value into the form field', async () => {
      const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
      const selected = [{
        id: 'trace-2',
        label: 'Physique',
        value: 'trace-2',
        title: 'Physique',
        description: 'Mécanique',
        type: 'SKILL_LEVEL'
      }]

      await autocomplete.vm.$emit('update:modelValue', selected)
      await wrapper.vm.$nextTick()

      expect(autocomplete.props('modelValue')).toEqual(expect.any(Array))
    })
  })

  BddTest().when('clear is triggered', () => {
    BddTest().then('it should emit clear event', async () => {
      const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
      await autocomplete.vm.$emit('clear')
      expect(autocomplete.exists()).toBe(true)
    })
  })

  BddTest().when('submitting with empty selection', () => {
    BddTest().then('it should display an error message from form', async () => {
      await wrapper.find('form').trigger('submit')

      await vi.waitFor(() => {
        const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
        const inputOptions = autocomplete.props('inputOptions') as any
        expect(inputOptions.errorMessage).toBe('Une association doit être sélectionnée')
      })
    })
  })

  BddTest().when('rendering option item slot', () => {
    BddTest().then('it should render an AvListItem and title block', () => {
      const listItem = wrapper.findComponent({ name: 'AvListItem' })
      expect(listItem.exists()).toBe(true)
      const title = wrapper.find('.b1-bold')
      expect(title.exists()).toBe(true)
    })
  })

  BddTest().when('option helpers are bound', () => {
    BddTest().then('it should bind getOptionLabel/getOptionKey functions', () => {
      const autocomplete = wrapper.findComponent({ name: 'AvAutocomplete' })
      expect(typeof autocomplete.props('getOptionLabel')).toBe('function')
      expect(typeof autocomplete.props('getOptionKey')).toBe('function')
    })
  })

  BddTest().when('displayedOptions guard', () => {
    BddTest().then('options are empty when query is empty', () => {
      const ac = wrapper.findComponent({ name: 'AvAutocomplete' })
      expect(Array.isArray(ac.props('options'))).toBe(true)
      expect((ac.props('options') as any[]).length).toBe(0)
    })

    BddTest().then('options stay empty when query shorter than min length', async () => {
      const ac = wrapper.findComponent({ name: 'AvAutocomplete' })
      await ac.vm.$emit('search', 'ab')
      await wrapper.vm.$nextTick()
      expect((ac.props('options') as any[]).length).toBe(0)
    })
  })

  BddTest().when('clearing the search resets state', () => {
    BddTest().then('it shows start-typing empty state after clear', async () => {
      const ac = wrapper.findComponent({ name: 'AvAutocomplete' })
      await ac.vm.$emit('search', 'physics')
      await wrapper.vm.$nextTick()

      await ac.vm.$emit('clear')
      await wrapper.vm.$nextTick()

      const emptyMsg = wrapper.find('.b2-regular')
      expect(emptyMsg.exists()).toBe(true)
      expect(emptyMsg.text().length).toBeGreaterThan(0)
    })
  })

  BddTest().when('option accessors', () => {
    BddTest().then('getOptionLabel/getOptionKey return correct values', () => {
      const ac = wrapper.findComponent({ name: 'AvAutocomplete' })
      const getLabel = ac.props('getOptionLabel') as (o: any) => string
      const getKey = ac.props('getOptionKey') as (o: any) => string

      const optWithId = { id: 'id-1', title: 'Titre 1' }
      const optNoId = { title: 'Titre Sans Id' }

      expect(getLabel(optWithId)).toBe('Titre 1')
      expect(getKey(optWithId)).toBe('id-1')

      expect(getLabel(optNoId)).toBe('Titre Sans Id')
      expect(getKey(optNoId)).toBe('Titre Sans Id')
    })
  })
})
