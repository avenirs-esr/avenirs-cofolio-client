import type { VueWrapper } from '@vue/test-utils'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect, vi } from 'vitest'
import { mockGroupOverview, mockGroupOverviewWithParent } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { GroupTypeBadgeStub } from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/badges/GroupTypeBadge/GroupTypeBadge.stub'
import { GroupCardStub } from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/cards/GroupCard/GroupCard.stub'
import GroupsList from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsList/GroupsList.vue'
import { GroupsListNameStub } from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsListName/GroupsListName.stub'
import { GroupsListParentNameStub } from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsListParentName/GroupsListParentName.stub'

const mockIsBelowLg = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({ isBelowLg: mockIsBelowLg }),
  }
})

BddTest().given('a groups list', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupsList>>

  const groups = [mockGroupOverview, mockGroupOverviewWithParent]

  const stubs = {
    AvTable: AvTableStub,
    GroupsListName: GroupsListNameStub,
    GroupsListParentName: GroupsListParentNameStub,
    GroupTypeBadge: GroupTypeBadgeStub,
    GroupCard: GroupCardStub
  }

  const mountWith = (groupsToDisplay = groups) => {
    wrapper = mount(GroupsList, {
      props: { groups: groupsToDisplay },
      global: { stubs },
    })
  }

  const getTable = () => wrapper.findComponent(AvTableStub)
  const getCardsContainer = () => wrapper.find('[data-testid="groups-list-cards"]')
  const getGroupCards = () => wrapper.findAllComponents(GroupCardStub)

  beforeEach(() => {
    mockIsBelowLg.value = false
  })

  BddTest().when('the component is rendered on a large screen', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should display the table', () => {
      expect(getTable().exists()).toBe(true)
    })

    BddTest().then('it should pass the groups to the table', () => {
      expect(getTable().props('rows')).toStrictEqual(groups)
    })

    BddTest().then('it should use the group id as row key', () => {
      expect(getTable().props('rowKey')).toBe('id')
    })

    BddTest().then('it should define the expected columns', () => {
      expect(getTable().props('columns')).toStrictEqual([
        {
          key: 'name',
          label: 'Groupe',
          width: '30%',
        },
        {
          key: 'type',
          label: 'Type',
          width: '20%',
        },
        {
          key: 'parentName',
          label: 'Rattaché à',
          width: '30%',
        },
        {
          key: 'usersCount',
          label: 'Nombre d\'utilisateur(rice)s',
          width: '20%',
        },
      ])
    })

    BddTest().then('it should render each group name', () => {
      expect(wrapper.findAll('[data-testid="group-list-table-name"]')).toHaveLength(groups.length)
    })

    BddTest().then('it should render each group type badge', () => {
      expect(wrapper.findAll('[data-testid="group-type-badge"]')).toHaveLength(groups.length)
    })

    BddTest().then('it should render each group parent name', () => {
      expect(wrapper.findAll('[data-testid="group-list-table-parent-name-stub"]')).toHaveLength(groups.length)
    })

    BddTest().then('it should display the users count for each group', () => {
      const usersCountCells = wrapper.findAll('[data-testid="group-list-users-count-cell"]')

      expect(usersCountCells).toHaveLength(groups.length)
      expect(usersCountCells.map(cell => cell.text())).toStrictEqual(
        groups.map(group => String(group.usersCount)),
      )
    })

    BddTest().then('it should pass the group to the name component', () => {
      const groupName = wrapper.findComponent(GroupsListNameStub)

      expect(groupName.props('group')).toStrictEqual(groups[0])
    })

    BddTest().then('it should pass the group type to the badge component', () => {
      const groupTypeBadge = wrapper.findComponent(GroupTypeBadgeStub)

      expect(groupTypeBadge.props('type')).toBe(groups[0].type)
    })

    BddTest().then('it should pass the group to the parent name component', () => {
      const groupParentName = wrapper.findComponent(GroupsListParentNameStub)

      expect(groupParentName.props('group')).toStrictEqual(groups[0])
    })

    BddTest().then('it should not display the cards container', () => {
      expect(getCardsContainer().exists()).toBe(false)
    })
  })

  BddTest().when('there are no groups on a large screen', () => {
    beforeEach(() => {
      mountWith([])
    })

    BddTest().then('it should pass an empty list to the table', () => {
      expect(getTable().props('rows')).toStrictEqual([])
    })
  })

  BddTest().when('the screen is below the large breakpoint', () => {
    beforeEach(() => {
      mockIsBelowLg.value = true
      mountWith()
    })

    BddTest().then('it should display the cards container', () => {
      expect(getCardsContainer().exists()).toBe(true)
    })

    BddTest().then('it should not display the table', () => {
      expect(getTable().exists()).toBe(false)
    })

    BddTest().then('it should render one card per group', () => {
      expect(getGroupCards()).toHaveLength(groups.length)
    })

    BddTest().then('it should pass each group to its card', () => {
      expect(getGroupCards().map(card => card.props('group'))).toStrictEqual(groups)
    })
  })

  BddTest().when('there are no groups below the large breakpoint', () => {
    beforeEach(() => {
      mockIsBelowLg.value = true
      mountWith([])
    })

    BddTest().then('it should display an empty cards container', () => {
      expect(getCardsContainer().exists()).toBe(true)
      expect(getGroupCards()).toHaveLength(0)
    })

    BddTest().then('it should not display the table', () => {
      expect(getTable().exists()).toBe(false)
    })
  })
})
