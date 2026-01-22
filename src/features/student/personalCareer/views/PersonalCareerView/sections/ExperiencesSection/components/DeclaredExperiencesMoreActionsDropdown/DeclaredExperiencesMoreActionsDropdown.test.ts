import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import DeclaredExperiencesMoreActionsDropdown
  from './DeclaredExperiencesMoreActionsDropdown.vue'

BddTest().given('a declared experiences more actions dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperiencesMoreActionsDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(DeclaredExperiencesMoreActionsDropdown, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the dropdown component', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().and('the dropdown props are validated', () => {
      let dropdown: VueWrapper<InstanceType<typeof AvDropdownStub>>

      beforeEach(() => {
        dropdown = wrapper.findComponent({ name: 'AvDropdown' }) as VueWrapper<InstanceType<typeof AvDropdownStub>>
      })

      BddTest().then('it should have trigger aria label', () => {
        expect(dropdown.props('triggerAriaLabel')).toBe('Plus d\'actions')
      })

      BddTest().then('it should have trigger label', () => {
        expect(dropdown.props('triggerLabel')).toBe('Plus d\'actions')
      })

      BddTest().then('it should have menu items with correct length', () => {
        expect(dropdown.props('items')).toHaveLength(3)
      })

      BddTest().then('it should have add item with correct properties', () => {
        const items = dropdown.props('items') as Array<{ name: string, icon: string, label: string }>
        const addItem = items.find(item => item.name === 'add')
        expect(addItem).toBeDefined()
        expect(addItem?.icon).toBe(MDI_ICONS.PLUS_CIRCLE_OUTLINE)
        expect(addItem?.label).toBe('Ajouter une expérience')
      })

      BddTest().then('it should have share item with correct properties', () => {
        const items = dropdown.props('items') as Array<{ name: string, icon: string, label: string }>
        const shareItem = items.find(item => item.name === 'share')
        expect(shareItem).toBeDefined()
        expect(shareItem?.icon).toBe(MDI_ICONS.SHARE_VARIANT_OUTLINE)
        expect(shareItem?.label).toBe('Partager une expérience')
      })

      BddTest().then('it should have delete item with correct properties', () => {
        const items = dropdown.props('items') as Array<{ name: string, icon: string, label: string }>
        const deleteItem = items.find(item => item.name === 'delete')
        expect(deleteItem).toBeDefined()
        expect(deleteItem?.icon).toBe(MDI_ICONS.TRASH_CAN_OUTLINE)
        expect(deleteItem?.label).toBe('Supprimer une expérience')
      })
    })
  })

  BddTest().when('the add item is selected', () => {
    beforeEach(() => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      dropdown.vm.$emit('itemSelected', 'add')
    })

    BddTest().then('it should emit addSelected event', () => {
      expect(wrapper.emitted('addSelected')).toBeTruthy()
      expect(wrapper.emitted('addSelected')?.[0]).toEqual([])
    })

    BddTest().then('it should not emit deleteSelected event', () => {
      expect(wrapper.emitted('deleteSelected')).toBeFalsy()
    })

    BddTest().then('it should not emit shareSelected event', () => {
      expect(wrapper.emitted('shareSelected')).toBeFalsy()
    })
  })

  BddTest().when('the delete item is selected', () => {
    beforeEach(() => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      dropdown.vm.$emit('itemSelected', 'delete')
    })

    BddTest().then('it should emit deleteSelected event', () => {
      expect(wrapper.emitted('deleteSelected')).toBeTruthy()
      expect(wrapper.emitted('deleteSelected')?.[0]).toEqual([])
    })

    BddTest().then('it should not emit addSelected event', () => {
      expect(wrapper.emitted('addSelected')).toBeFalsy()
    })

    BddTest().then('it should not emit shareSelected event', () => {
      expect(wrapper.emitted('shareSelected')).toBeFalsy()
    })
  })

  BddTest().when('the share item is selected', () => {
    beforeEach(() => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      dropdown.vm.$emit('itemSelected', 'share')
    })

    BddTest().then('it should emit shareSelected event', () => {
      expect(wrapper.emitted('shareSelected')).toBeTruthy()
      expect(wrapper.emitted('shareSelected')?.[0]).toEqual([])
    })

    BddTest().then('it should not emit addSelected event', () => {
      expect(wrapper.emitted('addSelected')).toBeFalsy()
    })

    BddTest().then('it should not emit deleteSelected event', () => {
      expect(wrapper.emitted('deleteSelected')).toBeFalsy()
    })
  })
})
