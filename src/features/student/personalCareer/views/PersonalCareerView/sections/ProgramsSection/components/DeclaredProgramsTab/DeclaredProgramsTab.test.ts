import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect, vi } from 'vitest'
import DeclaredProgramsTab from './DeclaredProgramsTab.vue'

const mockDisplayAddDeclaredProgramDrawer = vi.fn()

vi.mock('@/features/student/personalCareer/stores/personalCareer.store', () => ({
  usePersonalCareerStore: vi.fn(() => ({
    displayAddDeclaredProgramDrawer: mockDisplayAddDeclaredProgramDrawer
  }))
}))

BddTest().given('a declared programs tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramsTab>>

  const stubs = {
    DeclaredProgramsMoreActionsDropdown: defineComponent({
      name: 'DeclaredProgramsMoreActionsDropdown',
      emits: ['addSelected', 'deleteSelected', 'shareSelected'],
      template: '<div data-testid="declared-programs-more-actions-dropdown-stub"></div>'
    }),
    AddDeclaredProgramDrawer: defineComponent({
      name: 'AddDeclaredProgramDrawer',
      template: '<div data-testid="add-declared-program-drawer-stub"></div>'
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    wrapper = mount(DeclaredProgramsTab, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should have the declared-programs-tab class', () => {
      expect(wrapper.find('.declared-programs-tab').exists()).toBe(true)
    })

    BddTest().then('it should render the more actions dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'DeclaredProgramsMoreActionsDropdown' })
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the content placeholder', () => {
      expect(wrapper.find('.declared-programs__content').exists()).toBe(true)
      expect(wrapper.find('.declared-programs__content').text()).toBe('Placement for Declared Programs content')
    })

    BddTest().then('it should have the dropdown in a right-aligned row', () => {
      const row = wrapper.find('.av-row.av-justify-end')
      expect(row.exists()).toBe(true)
      const dropdown = row.findComponent({ name: 'DeclaredProgramsMoreActionsDropdown' })
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the add declared program drawer', () => {
      const drawer = wrapper.findComponent({ name: 'AddDeclaredProgramDrawer' })
      expect(drawer.exists()).toBe(true)
    })
  })

  BddTest().when('the add button is clicked in the dropdown', () => {
    beforeEach(() => {
      const dropdown = wrapper.findComponent({ name: 'DeclaredProgramsMoreActionsDropdown' })
      dropdown.vm.$emit('addSelected')
    })

    BddTest().then('it should call displayAddDeclaredProgramDrawer', () => {
      expect(mockDisplayAddDeclaredProgramDrawer).toHaveBeenCalledTimes(1)
    })
  })
})
