import type { AvDropdownItem } from '@avenirs-esr/avenirs-dsav'
import { moreActionConfig } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.config'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown, { type ManageEntityDropdownProps } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a ManageEntityDropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageEntityDropdown>>

  const allActions = Object.values(Action) as Action[]

  const stubs = {
    AvDropdown: AvDropdownStub,
  }

  const mountWith = (props: Partial<ManageEntityDropdownProps> = {}) => {
    wrapper = mount(ManageEntityDropdown, {
      props: { entityName: '', actions: [], ...props },
      global: { stubs },
    })
  }

  const getDropdown = () => wrapper.findComponent(AvDropdownStub)
  const getDropdownItems = () => getDropdown().props('items') as Array<AvDropdownItem>

  const toExpectedItem = (type: Action, separatorBefore?: boolean) => ({
    name: type,
    icon: moreActionConfig[type].icon,
    label: expect.any(String),
    separatorBefore: separatorBefore ?? expect.any(Boolean),
  })

  const expectRenderedActions = (types: Action[]) => {
    const expected = (Object.keys(moreActionConfig) as Action[])
      .filter(type => types.includes(type))
      .map(type => toExpectedItem(type))
    expect(getDropdownItems()).toEqual(expected)
  }

  const expectActionDisabled = (type: Action, disabled: boolean) => {
    const item = getDropdownItems().find(item => item.name === type)
    expect(Boolean(item?.disabled)).toBe(disabled)
  }

  const expectActionDisabledTooltip = (type: Action, disabledTooltip: string) => {
    const item = getDropdownItems().find(item => item.name === type)
    expect(String(item?.disabledTooltip)).toBe(disabledTooltip)
  }

  const expectDefaultLabel = () => {
    const dropdown = getDropdown()
    const label = 'Gérer'

    expect(dropdown.props('triggerLabel')).toBe(label)
    expect(dropdown.props('triggerAriaLabel')).toBe(label)
  }

  const expectCustomLabel = (entityName: string) => {
    const dropdown = getDropdown()
    const label = `Gérer ${entityName.toLowerCase()}`

    expect(dropdown.props('triggerLabel')).toBe(label)
    expect(dropdown.props('triggerAriaLabel')).toBe(label)
  }

  BddTest().when('no actions are requested', () => {
    beforeEach(() => {
      mountWith({ actions: [] })
    })

    BddTest().then('it should render no items', () => {
      expectRenderedActions([])
    })
  })

  BddTest().when('actions are requested in an order different from moreActionConfig', () => {
    const requested = [...allActions].reverse()

    beforeEach(() => {
      mountWith({ actions: requested })
    })

    BddTest().then('it should render them in the order defined by moreActionConfig, with their configured icon', () => {
      expectRenderedActions(requested)
    })
  })

  BddTest().when('the action configuration is ordered', () => {
    BddTest().then('it should keep the intended action order', () => {
      expect(Object.keys(moreActionConfig)).toEqual([
        Action.NAVIGATE_TO_FEEDBACKS,
        Action.ADD,
        Action.ASSOCIATE,
        Action.COLLAPSE,
        Action.DOWNLOAD,
        Action.EXPAND,
        Action.PUBLISH,
        Action.RESUBSCRIBE,
        Action.UPDATE,
        Action.UPDATE_IN_PROFILE,
        Action.CLONE,
        Action.UNPUBLISH,
        Action.UNSUBSCRIBE,
        Action.DELETE,
      ])
    })
  })

  BddTest().when('an action is not requested', () => {
    const [omitted, ...requested] = allActions

    beforeEach(() => {
      mountWith({ actions: requested })
    })

    BddTest().then('it should not render it, and keep the others in the moreActionConfig order', () => {
      expect(getDropdownItems().some(item => item.name === omitted)).toBe(false)
      expectRenderedActions(requested)
    })
  })

  BddTest().when('an action is requested with disabled set to true', () => {
    beforeEach(() => {
      mountWith({ actions: [{ type: Action.UPDATE, disabled: true }, Action.DELETE] })
    })

    BddTest().then('it should disable that action', () => {
      expectActionDisabled(Action.UPDATE, true)
    })

    BddTest().then('it should leave the other requested actions enabled', () => {
      expectActionDisabled(Action.DELETE, false)
    })
  })

  BddTest().when('an action is configured with a disabledTooltip', () => {
    beforeEach(() => {
      mountWith({ actions: [{ type: Action.UPDATE, disabledTooltip: 'test' }] })
    })

    BddTest().then('it should pass the disabledTooltip to the action', () => {
      expectActionDisabledTooltip(Action.UPDATE, 'test')
    })
  })

  BddTest().when('the update and delete actions are requested', () => {
    beforeEach(() => {
      mountWith({ actions: [Action.UPDATE, Action.DELETE] })
    })

    BddTest().then('it should display their translated labels', () => {
      const items = getDropdownItems()

      expect(items.find(item => item.name === Action.UPDATE)?.label).toBe('Modifier')
      expect(items.find(item => item.name === Action.DELETE)?.label).toBe('Supprimer')
    })
  })

  BddTest().when('an action is selected', () => {
    beforeEach(() => {
      mountWith({ actions: [Action.UPDATE] })
    })

    BddTest().then('it should emit actionSelected with that action', async () => {
      await getDropdown().vm.$emit('itemSelected', Action.UPDATE)
      expect(wrapper.emitted('actionSelected')).toEqual([[Action.UPDATE]])
    })
  })

  BddTest().when('the dropdown is rendered without an entity name', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should use the generic manage label', () => {
      expectDefaultLabel()
    })
  })

  BddTest().when('an entity name is provided', () => {
    const entityName = 'My Activity'

    beforeEach(() => {
      mountWith({ entityName })
    })

    BddTest().then('it should use the entity name in the manage label', () => {
      expectCustomLabel(entityName)
    })
  })

  BddTest().when('an empty entity name is provided', () => {
    const entityName = ' '

    beforeEach(() => {
      mountWith({ entityName })
    })

    BddTest().then('it should use the generic manage label', () => {
      expectDefaultLabel()
    })
  })

  BddTest().when('the dropdown is rendered with an icon only', () => {
    beforeEach(() => {
      mountWith({ icon: 'edit', iconOnly: true })
    })

    BddTest().then('it should render the dropdown with the icon only', () => {
      expect(getDropdown().props('triggerLabel')).toBeUndefined()
    })
  })

  BddTest().when('actions configured without separatorBefore and actions configured with separatorBefore are passed', () => {
    beforeEach(() => {
      mountWith({
        actions: [
          Action.PUBLISH,
          Action.UNPUBLISH,
          Action.DELETE,
          Action.UNSUBSCRIBE,
        ],
      })
    })

    BddTest().then('it should add a separator only before the first separated action', () => {
      expect(getDropdownItems()).toEqual([
        toExpectedItem(Action.PUBLISH, false),
        toExpectedItem(Action.UNPUBLISH, true),
        toExpectedItem(Action.UNSUBSCRIBE, false),
        toExpectedItem(Action.DELETE, false),
      ])
    })
  })

  BddTest().when('only actions configured with separatorBefore are passed', () => {
    beforeEach(() => {
      mountWith({
        actions: [
          Action.UNPUBLISH,
          Action.UNSUBSCRIBE,
          Action.DELETE,
        ],
      })
    })

    BddTest().then('it should not add any separator', () => {
      expect(getDropdownItems()).toEqual([
        toExpectedItem(Action.UNPUBLISH, false),
        toExpectedItem(Action.UNSUBSCRIBE, false),
        toExpectedItem(Action.DELETE, false),
      ])
    })
  })
})
