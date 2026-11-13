import type { SortableListProps } from '#shared/ui/components/interactions/lists/SortableList/SortableList.vue'
import type { VueWrapper } from '@vue/test-utils'
import SortableList from '#shared/ui/components/interactions/lists/SortableList/SortableList.vue'
import { AvSortableListStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a SortableList component', () => {
  let wrapper: VueWrapper

  const items = [
    { id: '1', label: 'First item' },
    { id: '2', label: 'Second item' }
  ]

  const stubs = {
    AvSortableList: AvSortableListStub
  }

  function mountDefault (props: Partial<SortableListProps<typeof items[number]>> = {}) {
    wrapper = mount(SortableList, {
      props: {
        modelValue: items,
        ...props
      },
      global: { stubs }
    })
  }

  const getSortableList = () => wrapper.findComponent(AvSortableListStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render with translated default props', () => {
      const sortableList = getSortableList()

      expect(sortableList.props('dragLabel')).toBe('Déplacer')
      expect(sortableList.props('moveUpLabel')).toBe('Monter')
      expect(sortableList.props('moveUpDisabledTooltip')).toBe('Cet élément est déjà en première position')
      expect(sortableList.props('moveDownLabel')).toBe('Descendre')
      expect(sortableList.props('moveDownDisabledTooltip')).toBe('Cet élément est déjà en dernière position')
    })

    BddTest().then('it should forward the component props', () => {
      expect(getSortableList().props('modelValue')).toEqual(items)
    })
  })

  BddTest().when('the component is mounted with additional attributes', () => {
    beforeEach(() => {
      wrapper = mount(SortableList, {
        attrs: {
          'aria-label': 'Liste des compétences'
        },
        props: {
          modelValue: items
        },
        global: { stubs }
      })
    })

    BddTest().then('it should forward the attributes to AvSortableList', () => {
      expect(getSortableList().attributes('aria-label')).toBe('Liste des compétences')
    })
  })

  BddTest().when('the component is mounted with a custom slot', () => {
    beforeEach(() => {
      wrapper = mount(SortableList, {
        props: {
          modelValue: items
        },
        slots: {
          default: ({ element, index }) => `${index}: ${element.label}`
        },
        global: { stubs }
      })
    })

    BddTest().then('it should forward the slot props', () => {
      expect(wrapper.text()).toContain('0: First item')
      expect(wrapper.text()).toContain('1: Second item')
    })
  })
})
