import { MoreActionsDropdownStub } from '@/common/components/interaction/dropdowns/MoreActionsDropdown/MoreActionsDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/MoreActionsDropdown/MoreActionsDropdown.types'
import NodeDropdown, { type NodeDropdownProps } from '@/common/components/VueFlow/NodeDropdown/NodeDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a node dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof NodeDropdown>>

  const stubs = {
    MoreActionsDropdown: MoreActionsDropdownStub
  }

  const getMoreActionsDropdown = () => wrapper.findComponent(MoreActionsDropdownStub)
  const getActionByName = (name: Action) => {
    return getMoreActionsDropdown().props('actions').find(action => (action as Action) === name)
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(NodeDropdown, { global: { stubs } })
    })

    BddTest().then('it should render the dropdown', () => {
      expect(getMoreActionsDropdown().exists()).toBe(true)
    })

    BddTest().then('it should render the default actions', () => {
      const dropdown = getMoreActionsDropdown()
      const actions = dropdown.props('actions')
      expect(actions).toHaveLength(3)
      expect(actions).toEqual([Action.UPDATE, Action.DELETE, Action.COLLAPSE])
    })

    BddTest().then('it should not render the custom items', () => {
      expect(getActionByName(Action.UPDATE_IN_PROFILE)).toBeUndefined()
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

    BddTest().then('it should render the expand item', () => {
      expect(getActionByName(Action.EXPAND)).toBeDefined()
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
      expect(getActionByName(Action.UPDATE_IN_PROFILE)).toBeDefined()
    })

    BddTest().and('the update item is clicked', () => {
      beforeEach(() => {
        const updateButton = wrapper.find('[data-testid="update"]')
        updateButton.trigger('click')
      })

      BddTest().then('it should emit the update event', () => {
        expect(wrapper.emitted('update')).toHaveLength(1)
      })
    })

    BddTest().and('the remove item is clicked', () => {
      beforeEach(() => {
        const removeButton = wrapper.find('[data-testid="delete"]')
        removeButton.trigger('click')
      })

      BddTest().then('it should emit the remove event', () => {
        expect(wrapper.emitted('remove')).toHaveLength(1)
      })
    })

    BddTest().and('the collapse item is clicked', () => {
      beforeEach(() => {
        const collapseButton = wrapper.find('[data-testid="collapse"]')
        collapseButton.trigger('click')
      })

      BddTest().then('it should emit the toggleCollapse event', () => {
        expect(wrapper.emitted('collapse')).toHaveLength(1)
      })
    })

    BddTest().and('the updateInProfile item is clicked', () => {
      beforeEach(() => {
        const updateInProfileButton = wrapper.find('[data-testid="updateInProfile"]')
        updateInProfileButton.trigger('click')
      })

      BddTest().then('it should emit the updateInProfile event', () => {
        expect(wrapper.emitted('updateInProfile')).toHaveLength(1)
      })
    })
  })
})
