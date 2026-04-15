import type { AssociateElementOption, AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import { SearchAssociationLayoutStub } from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.stub'
import AssociateElementsDrawerSection, {
  type AssociateElementsDrawerSectionProps
} from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/AssociateElementsDrawerSection/AssociateElementsDrawerSection.vue'
import { AssociateElementTypeSelectStub } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/AssociationElementTypeSelect/AssociateElementTypeSelect.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const declaredSkillsConfig: AssociateElementTypeConfig = {
  key: 'declaredSkills',
  label: 'Compétences déclarées',
  searchPlaceholder: 'Rechercher une compétence...'
}

const activitiesConfig: AssociateElementTypeConfig = {
  key: 'activities',
  label: 'Activités',
  searchPlaceholder: 'Rechercher une activité...'
}

const typeConfigs: AssociateElementTypeConfig[] = [declaredSkillsConfig, activitiesConfig]

const options: AssociateElementOption[] = [
  { id: 'skill-1', title: 'Compétence 1', description: 'Rome 4.0' },
  { id: 'skill-2', title: 'Compétence 2', description: 'XXIᵉ onisep' },
  { id: 'skill-3', title: 'Compétence 3', description: 'Rome 4.0', disabled: true }
]

BddTest().given('an associate elements drawer section', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateElementsDrawerSection>>

  const stubs = {
    AssociateElementTypeSelect: AssociateElementTypeSelectStub,
    SearchAssociationLayout: SearchAssociationLayoutStub,
  }

  const defaultProps: AssociateElementsDrawerSectionProps = {
    typeConfigs,
    options,
    loading: false
  }

  function getSearchLayout () {
    return wrapper.findComponent(SearchAssociationLayoutStub)
  }

  function getTypeSelect () {
    return wrapper.findComponent(AssociateElementTypeSelectStub)
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
    })

    BddTest().then('it should pass autocomplete options mapped from element options', () => {
      const autocompleteOptions = getSearchLayout().props('options') as AvAutocompleteOption[]

      expect(autocompleteOptions).toHaveLength(3)
      expect(autocompleteOptions[0]).toMatchObject({ value: 'skill-1', label: 'Compétence 1', description: 'Rome 4.0' })
      expect(autocompleteOptions[2]).toMatchObject({ value: 'skill-3', disabled: true })
    })

    BddTest().then('it should pass the search placeholder from the active type config', () => {
      expect(getSearchLayout().props('inputOptions')).toMatchObject({
        placeholder: declaredSkillsConfig.searchPlaceholder
      })
    })

    BddTest().then('it should pass an empty items list initially', () => {
      expect(getSearchLayout().props('items')).toHaveLength(0)
    })
  })

  BddTest().when('the user searches', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getSearchLayout().vm.$emit('search', 'Compétence')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit search event', () => {
      expect(wrapper.emitted('search')).toBeTruthy()
      expect(wrapper.emitted('search')?.[0]).toEqual(['Compétence'])
    })
  })

  BddTest().when('the user selects items', () => {
    const selectedOptions: AvAutocompleteOption[] = [
      { value: 'skill-1', label: 'Compétence 1', description: 'Rome 4.0' },
      { value: 'skill-2', label: 'Compétence 2', description: 'XXIᵉ onisep' }
    ]

    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getSearchLayout().vm.$emit('update:modelValue', selectedOptions)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:selectionsByType with selections organized by type', () => {
      expect(wrapper.emitted('update:selectionsByType')).toBeTruthy()
      expect(wrapper.emitted('update:selectionsByType')?.[0]).toEqual([{
        declaredSkills: [
          { id: 'skill-1', title: 'Compétence 1', description: 'Rome 4.0' },
          { id: 'skill-2', title: 'Compétence 2', description: 'XXIᵉ onisep' }
        ]
      }])
    })

    BddTest().then('it should pass selected items to the layout', () => {
      const items = getSearchLayout().props('items') as { id: string, title: string }[]

      expect(items).toHaveLength(2)
      expect(items[0]).toMatchObject({ id: 'skill-1', title: 'Compétence 1' })
      expect(items[1]).toMatchObject({ id: 'skill-2', title: 'Compétence 2' })
    })
  })

  BddTest().when('the user deletes an item from the selected list', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getSearchLayout().vm.$emit('update:modelValue', [
        { value: 'skill-1', label: 'Compétence 1', description: 'Rome 4.0' },
        { value: 'skill-2', label: 'Compétence 2', description: 'XXIᵉ onisep' }
      ])
      await wrapper.vm.$nextTick()

      getSearchLayout().vm.$emit('delete', 'skill-1')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should remove the deleted item from selectionsByType', () => {
      const emitted = wrapper.emitted('update:selectionsByType')
      const lastEmit = emitted?.[emitted.length - 1]

      expect(lastEmit).toEqual([{
        declaredSkills: [
          { id: 'skill-2', title: 'Compétence 2', description: 'XXIᵉ onisep' }
        ]
      }])
    })

    BddTest().then('it should update the items passed to the layout', () => {
      const items = getSearchLayout().props('items') as { id: string }[]

      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({ id: 'skill-2' })
    })
  })

  BddTest().when('the user selects items then options are filtered', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getSearchLayout().vm.$emit('update:modelValue', [
        { value: 'skill-1', label: 'Compétence 1', description: 'Rome 4.0' },
        { value: 'skill-2', label: 'Compétence 2', description: 'XXIᵉ onisep' }
      ])
      await wrapper.vm.$nextTick()

      await wrapper.setProps({
        options: [{ id: 'skill-1', title: 'Compétence 1', description: 'Rome 4.0' }]
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

      getTypeSelect().vm.$emit('typeChange', 'activities')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit typeChange event with the new type key', () => {
      expect(wrapper.emitted('typeChange')).toBeTruthy()
      expect(wrapper.emitted('typeChange')?.[0]).toEqual(['activities'])
    })

    BddTest().then('it should pass empty items for the new type', () => {
      expect(getSearchLayout().props('items')).toHaveLength(0)
    })
  })

  BddTest().when('the user selects items in one type, switches type, then switches back', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementsDrawerSection, {
        props: defaultProps,
        global: { stubs }
      })

      getSearchLayout().vm.$emit('update:modelValue', [
        { value: 'skill-1', label: 'Compétence 1', description: 'Rome 4.0' }
      ])
      await wrapper.vm.$nextTick()

      getTypeSelect().vm.$emit('typeChange', 'activities')
      await wrapper.vm.$nextTick()

      getTypeSelect().vm.$emit('typeChange', 'declaredSkills')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should restore the previously selected items', () => {
      const items = getSearchLayout().props('items') as { title: string }[]

      expect(items).toHaveLength(1)
      expect(items[0]).toMatchObject({ title: 'Compétence 1' })
    })

    BddTest().then('it should restore the modelValue on the layout', () => {
      expect(getSearchLayout().props('modelValue')).toEqual([
        { value: 'skill-1', label: 'Compétence 1', description: 'Rome 4.0' }
      ])
    })
  })
})
