import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { GroupsListRow } from '@/features/staff/admin/components/dataDisplay/GroupsList/GroupsList.types'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { mockGroupOverview, mockGroupOverviewWithParent } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { GroupTypeBadgeStub } from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.stub'
import { GroupNameStub } from '@/features/staff/admin/components/base/GroupName/GroupName.stub'
import GroupOverviewList from '@/features/staff/admin/components/base/GroupOverviewList/GroupOverviewList.vue'
import { GroupParentNameStub } from '@/features/staff/admin/components/base/GroupParentName/GroupParentName.stub'
import { GroupOverviewCardStub } from '@/features/staff/admin/components/cards/GroupOverviewCard/GroupOverviewCard.stub'

const mockIsBelowLg = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isBelowLg: mockIsBelowLg }),
  }
})

BddTest().given('a group overview list', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupOverviewList>>

  const rows = [
    mockGroupOverview,
    mockGroupOverviewWithParent,
  ] as unknown as GroupsListRow[]

  const columns: AvTableColumn<GroupsListRow>[] = [
    { key: 'name', label: 'Nom' },
    { key: 'type', label: 'Type' },
    { key: 'parentName', label: 'Groupe parent' },
    { key: 'usersCount', label: 'Nombre d’utilisateurs' },
  ]

  const stubs = {
    AvTable: AvTableStub,
    GroupName: GroupNameStub,
    GroupTypeBadge: GroupTypeBadgeStub,
    GroupParentName: GroupParentNameStub,
    GroupOverviewCard: GroupOverviewCardStub,
  }

  const mountWith = async (options: {
    belowLg?: boolean
    subGroupMode?: boolean
    rows?: GroupsListRow[]
    columns?: AvTableColumn<GroupsListRow>[]
  } = {}) => {
    const {
      belowLg = false,
      subGroupMode = false,
      rows: rowsProp = rows,
      columns: columnsProp = columns,
    } = options

    mockIsBelowLg.value = belowLg

    wrapper = mountComponent(GroupOverviewList, {
      props: {
        rows: rowsProp,
        columns: columnsProp,
        subGroupMode,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getTable = () => wrapper.findComponent(AvTableStub)
  const getCardsContainer = () => wrapper.find('[data-testid="group-overview-list-cards"]')
  const getCards = () => wrapper.findAllComponents(GroupOverviewCardStub)

  BddTest().when('the screen is at least the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the table instead of the cards', () => {
      expect(getTable().exists()).toBe(true)
      expect(wrapper.find('[data-testid="group-overview-list-table"]').exists()).toBe(true)
      expect(getCardsContainer().exists()).toBe(false)
    })

    BddTest().then('it should pass the rows and columns to the table', () => {
      expect(getTable().props('rows')).toEqual(rows)
      expect(getTable().props('columns')).toEqual(columns)
    })

    BddTest().then('it should use id as the row key', () => {
      expect(getTable().props('rowKey')).toBe('id')
    })
  })

  BddTest().when('the screen is below the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith({ belowLg: true })
    })

    BddTest().then('it should render cards instead of the table', () => {
      expect(getCardsContainer().exists()).toBe(true)
      expect(getTable().exists()).toBe(false)
    })

    BddTest().then('it should render one card per group', () => {
      expect(getCards()).toHaveLength(rows.length)
    })

    BddTest().then('it should pass each group to its card', () => {
      expect(getCards()[0].props('group')).toEqual(rows[0])
      expect(getCards()[1].props('group')).toEqual(rows[1])
    })

    BddTest().then('it should not enable subgroup mode by default', () => {
      expect(getCards().every(card => card.props('isSubGroup') === false)).toBe(true)
    })
  })

  BddTest().when('the list is in subgroup mode on a large screen', () => {
    beforeEach(async () => {
      await mountWith({ subGroupMode: true })
    })

    BddTest().then('it should still render the table with the supplied rows and columns', () => {
      expect(getTable().exists()).toBe(true)
      expect(getTable().props('rows')).toEqual(rows)
      expect(getTable().props('columns')).toEqual(columns)
    })
  })

  BddTest().when('the list is in subgroup mode on a small screen', () => {
    beforeEach(async () => {
      await mountWith({
        belowLg: true,
        subGroupMode: true,
      })
    })

    BddTest().then('it should pass subgroup mode to every card', () => {
      expect(getCards()).toHaveLength(rows.length)
      expect(getCards().every(card => card.props('isSubGroup') === true)).toBe(true)
    })
  })

  BddTest().when('the rows are empty', () => {
    beforeEach(async () => {
      await mountWith({ rows: [] })
    })

    BddTest().then('it should pass an empty list to the table', () => {
      expect(getTable().props('rows')).toEqual([])
    })
  })
})
