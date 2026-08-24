import type { Association } from '@/features/student/global/types/associations.types'
import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import { AssociateElementTypeSelectStub } from '@/features/student/global/components/interaction/AssociationElementTypeSelect/AssociateElementTypeSelect.stub'
import { SearchAssociationLayoutStub } from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.stub'
import AssociateElementsDrawerSection from '@/features/student/global/components/sections/AssociateElementsDrawerSection/AssociateElementsDrawerSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const typeConfigs: AssociateElementTypeConfig[] = [
  {
    key: 'associations-1',
    label: 'Associations 1',
  },
  {
    key: 'associations-2',
    label: 'Associations 2',
    searchPlaceholder: 'Rechercher une association 2...'
  },
  {
    key: 'associations-3',
    label: 'Associations 3',
    subConfigs: [
      {
        key: 'sub-associations-1',
        label: 'Sub Associations 1',
        searchPlaceholder: 'Rechercher une sub association 1...'
      },
      {
        key: 'sub-associations-2',
        label: 'Sub Associations 2',
        searchPlaceholder: 'Rechercher une sub association 2...'
      }
    ]
  }
]

const options: Association[] = [
  { id: 'association-1', title: 'Association 1', description: 'Association 1' },
  { id: 'association-2', title: 'Association 2', description: 'Association 2' },
  { id: 'association-3', title: 'Association 3', description: 'Association 3' }
]

// The layout stub deals in AvAutocompleteOption ({ value, label, ... }), not Association
// ({ id, title, ... }). This helper mirrors the component's own mapping so the tests emit
// and assert on the shape the real component actually produces/consumes.
function toAutocompleteOption (option: Association): AvAutocompleteOption {
  return {
    value: option.id,
    label: option.title,
    description: option.description,
    disabled: option.disabled
  }
}

BddTest().given('an associate elements drawer section', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateElementsDrawerSection>>

  const stubs = {
    AssociateElementTypeSelect: AssociateElementTypeSelectStub,
    SearchAssociationLayout: SearchAssociationLayoutStub,
  }

  const defaultProps = {
    typeConfigs,
    options,
    loading: false,
    activeTypeKey: typeConfigs[0].key
  }

  function getSearchLayout () {
    return wrapper.findComponent(SearchAssociationLayoutStub)
  }

  function getTypeSelect () {
    return wrapper.findComponent('[data-testid="associate-elements-type-select"]') as VueWrapper<InstanceType<typeof AssociateElementTypeSelectStub>>
  }

  function getSubTypeSelect () {
    return wrapper.findComponent('[data-testid="associate-elements-sub-type-select"]') as VueWrapper<InstanceType<typeof AssociateElementTypeSelectStub>>
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })
    })

    BddTest().then('it should render the component wrapper', () => {
      expect(wrapper.find('[data-testid="associate-elements-drawer-section"]').exists()).toBe(true)
    })

    BddTest().then('it should render the type select with correct configs', () => {
      expect(getTypeSelect().exists()).toBe(true)
      expect(getTypeSelect().props('typeConfigs')).toEqual(typeConfigs)
      expect(getTypeSelect().props('activeTypeKey')).toBe(typeConfigs[0].key)
      expect(getTypeSelect().props('isSubType')).toBe(false)
    })

    BddTest().then('it should not render the subtype select', () => {
      expect(getSubTypeSelect().exists()).toBe(false)
    })

    BddTest().then('it should pass autocomplete options mapped from element options', () => {
      const autocompleteOptions = getSearchLayout().props('options') as AvAutocompleteOption[]

      expect(autocompleteOptions).toHaveLength(3)
      expect(autocompleteOptions[0]).toMatchObject(toAutocompleteOption(options[0]))
      expect(autocompleteOptions[1]).toMatchObject(toAutocompleteOption(options[1]))
      expect(autocompleteOptions[2]).toMatchObject(toAutocompleteOption(options[2]))
    })

    BddTest().then('it should use the default search placeholder', () => {
      expect(getSearchLayout().props('inputOptions')).toMatchObject({ placeholder: 'Rechercher...' })
    })

    BddTest().then('it should pass an empty items list initially', () => {
      expect(getSearchLayout().props('items')).toHaveLength(0)
    })
  })

  BddTest().when('the active type has sub configs', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: {
          ...defaultProps,
          activeTypeKey: typeConfigs[2].key
        },
        global: { stubs }
      })

      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should render the subtype select with correct configs', () => {
      expect(getSubTypeSelect().exists()).toBe(true)
      expect(getSubTypeSelect().props('typeConfigs')).toEqual(typeConfigs[2].subConfigs)
      expect(getSubTypeSelect().props('activeTypeKey')).toBeUndefined()
      expect(getSubTypeSelect().props('isSubType')).toBe(true)
    })

    BddTest().then('it should use the first sub config search placeholder by default', () => {
      expect(getSearchLayout().props('inputOptions')).toMatchObject({
        placeholder: typeConfigs[2].subConfigs![0].searchPlaceholder
      })
    })
  })

  BddTest().when('the component is mounted with an active subtype', () => {
    beforeEach(() => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: {
          ...defaultProps,
          activeTypeKey: typeConfigs[2].key,
          activeSubTypeKey: typeConfigs[2].subConfigs![1].key
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the subtype select with the active subtype', () => {
      expect(getSubTypeSelect().exists()).toBe(true)
      expect(getSubTypeSelect().props('typeConfigs')).toEqual(typeConfigs[2].subConfigs)
      expect(getSubTypeSelect().props('activeTypeKey')).toBe(typeConfigs[2].subConfigs![1].key)
      expect(getSubTypeSelect().props('isSubType')).toBe(true)
    })

    BddTest().then('it should use the active subtype search placeholder', () => {
      expect(getSearchLayout().props('inputOptions')).toMatchObject({
        placeholder: typeConfigs[2].subConfigs![1].searchPlaceholder
      })
    })
  })

  BddTest().when('the user changes the selected subtype', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: {
          ...defaultProps,
          activeTypeKey: typeConfigs[2].key
        },
        global: { stubs }
      })

      getSubTypeSelect().vm.$emit('update:activeTypeKey', typeConfigs[2].subConfigs![1].key)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:activeSubTypeKey with the new subtype key', () => {
      expect(wrapper.emitted('update:activeSubTypeKey')).toBeTruthy()
      expect(wrapper.emitted('update:activeSubTypeKey')?.[0]).toEqual([typeConfigs[2].subConfigs![1].key])
    })

    BddTest().then('it should forward the new subtype key to the subtype select', () => {
      expect(getSubTypeSelect().props('activeTypeKey')).toBe(typeConfigs[2].subConfigs![1].key)
    })

    BddTest().then('it should use the selected sub config search placeholder', () => {
      expect(getSearchLayout().props('inputOptions')).toMatchObject({
        placeholder: typeConfigs[2].subConfigs![1].searchPlaceholder
      })
    })
  })

  BddTest().when('the user changes the subtype after selecting items', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: {
          ...defaultProps,
          activeTypeKey: typeConfigs[2].key
        },
        global: { stubs }
      })

      getSubTypeSelect().vm.$emit('update:activeTypeKey', typeConfigs[2].subConfigs![1].key)
      await wrapper.vm.$nextTick()

      getSearchLayout().vm.$emit('update:modelValue', [toAutocompleteOption(options[0])])
      await wrapper.vm.$nextTick()

      getSubTypeSelect().vm.$emit('update:activeTypeKey', typeConfigs[2].subConfigs![0].key)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should keep the selected items when changing subtype', () => {
      const items = getSearchLayout().props('items') as Association[]

      expect(items).toHaveLength(1)
      expect(items[0]).toEqual({ ...options[0], disabled: false })
    })

    BddTest().then('it should keep the selections organized by active type', () => {
      const emitted = wrapper.emitted('update:selectionsByType')
      const lastEmit = emitted?.[emitted.length - 1]

      expect(lastEmit).toEqual([{
        [typeConfigs[2].key]: [{ ...options[0], disabled: false }]
      }])
    })

    BddTest().then('it should update the active subtype without clearing the search selection', () => {
      expect(getSubTypeSelect().props('activeTypeKey')).toBe(typeConfigs[2].subConfigs![0].key)
      expect(getSearchLayout().props('modelValue')).toEqual([
        toAutocompleteOption({
          ...options[0],
          disabled: false
        })
      ])
    })
  })

  BddTest().when('the active type key changes', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: {
          ...defaultProps,
          activeTypeKey: typeConfigs[2].key,
          activeSubTypeKey: typeConfigs[2].subConfigs![1].key
        },
        global: { stubs }
      })

      await wrapper.setProps({
        activeTypeKey: typeConfigs[1].key
      })
    })

    BddTest().then('it should reset the active subtype key', () => {
      expect(wrapper.emitted('update:activeSubTypeKey')).toBeTruthy()
      expect(wrapper.emitted('update:activeSubTypeKey')?.at(-1)).toEqual([undefined])
    })

    BddTest().then('it should hide the subtype select', () => {
      expect(getSubTypeSelect().exists()).toBe(false)
    })

    BddTest().then('it should use the active type search placeholder', () => {
      expect(getSearchLayout().props('inputOptions')).toMatchObject({
        placeholder: typeConfigs[1].searchPlaceholder
      })
    })
  })

  BddTest().when('the underlying layout updates its search model', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getSearchLayout().vm.$emit('update:search', 'Compétence')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:searchQuery with the new value', () => {
      expect(wrapper.emitted('update:searchQuery')).toBeTruthy()
      expect(wrapper.emitted('update:searchQuery')?.[0]).toEqual(['Compétence'])
    })
  })

  BddTest().when('the user selects items', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getSearchLayout().vm.$emit('update:modelValue', [toAutocompleteOption(options[0]), toAutocompleteOption(options[1])])
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:selectionsByType with selections organized by type', () => {
      expect(wrapper.emitted('update:selectionsByType')).toBeTruthy()
      expect(wrapper.emitted('update:selectionsByType')?.[0]).toEqual([{
        [typeConfigs[0].key]: [
          { ...options[0], disabled: false },
          { ...options[1], disabled: false }
        ]
      }])
    })

    BddTest().then('it should pass selected items to the layout', () => {
      const items = getSearchLayout().props('items') as Association[]

      expect(items).toHaveLength(2)
      expect(items[0]).toEqual({ ...options[0], disabled: false })
      expect(items[1]).toEqual({ ...options[1], disabled: false })
    })
  })

  BddTest().when('the user deletes an item from the selected list', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getSearchLayout().vm.$emit('update:modelValue', [toAutocompleteOption(options[0]), toAutocompleteOption(options[1])])
      await wrapper.vm.$nextTick()

      getSearchLayout().vm.$emit('delete', options[0].id)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should remove the deleted item from selectionsByType', () => {
      const emitted = wrapper.emitted('update:selectionsByType')
      const lastEmit = emitted?.[emitted.length - 1]

      expect(lastEmit).toEqual([{
        [typeConfigs[0].key]: [{ ...options[1], disabled: false }]
      }])
    })

    BddTest().then('it should update the items passed to the layout', () => {
      const items = getSearchLayout().props('items') as Association[]

      expect(items).toHaveLength(1)
      expect(items[0]).toEqual({ ...options[1], disabled: false })
    })
  })

  BddTest().when('the user selects items then options are filtered', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getSearchLayout().vm.$emit('update:modelValue', [toAutocompleteOption(options[0]), toAutocompleteOption(options[1])])
      await wrapper.vm.$nextTick()

      await wrapper.setProps({
        options: [options[0]]
      })
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should keep all selected items in the layout', () => {
      expect(getSearchLayout().props('items')).toHaveLength(2)
    })
  })

  BddTest().when('the user changes the selected type', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getTypeSelect().vm.$emit('update:activeTypeKey', typeConfigs[1].key)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:activeTypeKey with the new type key', () => {
      expect(wrapper.emitted('update:activeTypeKey')).toBeTruthy()
      expect(wrapper.emitted('update:activeTypeKey')?.[0]).toEqual([typeConfigs[1].key])
    })

    BddTest().then('it should pass empty items for the new type', () => {
      expect(getSearchLayout().props('items')).toHaveLength(0)
    })
  })

  BddTest().when('the active type key prop changes externally', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: {
          ...defaultProps,
          selectionsByType: {
            [typeConfigs[0].key]: [options[0]]
          }
        },
        global: { stubs }
      })

      await wrapper.setProps({ activeTypeKey: typeConfigs[1].key })
    })

    BddTest().then('it should display items for the newly active type only', () => {
      expect(getSearchLayout().props('items')).toHaveLength(0)
    })

    BddTest().then('it should forward the new active type key to the type select', () => {
      expect(getTypeSelect().props('activeTypeKey')).toBe(typeConfigs[1].key)
    })

    BddTest().then('it should not render the subtype select', () => {
      expect(getSubTypeSelect().exists()).toBe(false)
    })
  })

  BddTest().when('the user selects items in one type, switches type, then switches back', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getSearchLayout().vm.$emit('update:modelValue', [toAutocompleteOption(options[0])])
      await wrapper.vm.$nextTick()

      getTypeSelect().vm.$emit('update:activeTypeKey', typeConfigs[1].key)
      await wrapper.vm.$nextTick()

      getTypeSelect().vm.$emit('update:activeTypeKey', typeConfigs[0].key)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should restore the previously selected items', () => {
      const items = getSearchLayout().props('items') as Association[]

      expect(items).toHaveLength(1)
      expect(items[0]).toEqual({ ...options[0], disabled: false })
    })

    BddTest().then('it should restore the modelValue on the layout', () => {
      expect(getSearchLayout().props('modelValue')).toEqual([toAutocompleteOption({
        ...options[0],
        disabled: false
      })])
    })
  })

  BddTest().when('the parent resets selectionsByType externally', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: {
          ...defaultProps,
          selectionsByType: {
            [typeConfigs[0].key]: [options[0]]
          }
        },
        global: { stubs }
      })

      await wrapper.setProps({ selectionsByType: {} })
    })

    BddTest().then('it should clear the items displayed in the layout', () => {
      expect(getSearchLayout().props('items')).toHaveLength(0)
    })

    BddTest().then('it should clear the modelValue on the layout', () => {
      expect(getSearchLayout().props('modelValue')).toEqual([])
    })
  })
})
