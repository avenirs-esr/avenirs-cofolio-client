import NodeDropdown, { type NodeDropdownProps } from '@/common/components/VueFlow/NodeDropdown/NodeDropdown.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a node dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof NodeDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(NodeDropdown, { global: { stubs } })
    })

    BddTest().then('it should render the dropdown', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should render the default items', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      const items = dropdown.props('items')
      expect(items).toHaveLength(3)
      expect(items).toEqual([
        { name: 'update', icon: MDI_ICONS.PENCIL_OUTLINE, label: 'Modifier' },
        { name: 'remove', icon: MDI_ICONS.TRASH_CAN_OUTLINE, label: 'Supprimer' },
        { name: 'collapse', icon: MDI_ICONS.MINUS, label: 'Réduire' }
      ])
    })

    BddTest().then('it should not render the custom items', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      const items = dropdown.props('items')
      expect(items.find((item: { name: string }) => item.name === 'updateInProfile')).toBeUndefined()
    })
  })

  BddTest().when('the component is mounted with collapsed prop', () => {
    const props: NodeDropdownProps = { collapsed: true }

    beforeEach(() => {
      wrapper = mount(NodeDropdown, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the collapse item as expand', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      const items = dropdown.props('items')
      const collapseItem = items.find((item: { name: string }) => item.name === 'collapse')
      expect(collapseItem).toBeDefined()
      expect(collapseItem.label).toBe('Développer')
      expect(collapseItem.icon).toBe(MDI_ICONS.PLUS)
    })
  })

  BddTest().when('the component is mounted with updateInProfile prop', () => {
    const props: NodeDropdownProps = { withProfileUpdate: true }

    beforeEach(() => {
      wrapper = mount(NodeDropdown, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the custom updateInProfile item', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      const items = dropdown.props('items')
      expect(items).toHaveLength(4)

      const updateInProfileItem = items.find((item: { name: string }) => item.name === 'updateInProfile')
      expect(updateInProfileItem).toBeDefined()
      expect(updateInProfileItem.label).toBe('Mettre à jour dans mon profil')
      expect(updateInProfileItem.icon).toBe(MDI_ICONS.TRAY_UPLOAD)
    })

    BddTest().and('the update item is clicked', () => {
      beforeEach(() => {
        const updateButton = wrapper.find('[data-name="update"]')
        updateButton.trigger('click')
      })

      BddTest().then('it should emit the update event', () => {
        expect(wrapper.emitted('update')).toHaveLength(1)
      })
    })

    BddTest().and('the remove item is clicked', () => {
      beforeEach(() => {
        const removeButton = wrapper.find('[data-name="remove"]')
        removeButton.trigger('click')
      })

      BddTest().then('it should emit the remove event', () => {
        expect(wrapper.emitted('remove')).toHaveLength(1)
      })
    })

    BddTest().and('the collapse item is clicked', () => {
      beforeEach(() => {
        const collapseButton = wrapper.find('[data-name="collapse"]')
        collapseButton.trigger('click')
      })

      BddTest().then('it should emit the toggleCollapse event', () => {
        expect(wrapper.emitted('collapse')).toHaveLength(1)
      })
    })

    BddTest().and('the updateInProfile item is clicked', () => {
      beforeEach(() => {
        const updateInProfileButton = wrapper.find('[data-name="updateInProfile"]')
        updateInProfileButton.trigger('click')
      })

      BddTest().then('it should emit the updateInProfile event', () => {
        expect(wrapper.emitted('updateInProfile')).toHaveLength(1)
      })
    })
  })
})
