import SortSelect from '@/common/components/interaction/selects/SortSelect/SortSelect.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a sort select component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SortSelect>>
  const stubs = { AvSelect: AvSelectStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(SortSelect, {
        props: {
          selectedItem: { itemId: 'NAME_ASC' }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the AvSelect component', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.exists()).toBe(true)
    })

    BddTest().then('it should use the global sort label', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('label')).toBe('Trier')
    })

    BddTest().then('it should provide the 4 name/date sort options', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('options')).toEqual([
        { id: 'NAME_ASC', label: 'Trier de A à Z' },
        { id: 'NAME_DESC', label: 'Trier de Z à A' },
        { id: 'DATE_DESC', label: 'Trier du plus récent au plus ancien' },
        { id: 'DATE_ASC', label: 'Trier du plus ancien au plus récent' }
      ])
    })
  })

  BddTest().when('the user selects a different option', () => {
    beforeEach(() => {
      wrapper = mount(SortSelect, {
        props: {
          selectedItem: { itemId: 'NAME_ASC' }
        },
        global: { stubs }
      })

      const select = wrapper.findComponent({ name: 'AvSelect' })
      select.vm.$emit('update:selectedItem', { itemId: 'DATE_DESC' })
    })

    BddTest().then('it should emit the new selected item', () => {
      expect(wrapper.emitted('update:selectedItem')?.[0]).toEqual([{ itemId: 'DATE_DESC' }])
    })
  })
})
