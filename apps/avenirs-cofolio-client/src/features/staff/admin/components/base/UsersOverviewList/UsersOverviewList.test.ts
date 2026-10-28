import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { UsersListRow } from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.types'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { EGroupType } from '@/api/avenir-esr'
import { GroupNameStub } from '@/features/staff/admin/components/base/GroupName/GroupName.stub'
import { UserNameStub } from '@/features/staff/admin/components/base/UserName/UserName.stub'
import UsersOverviewList from '@/features/staff/admin/components/base/UsersOverviewList/UsersOverviewList.vue'
import { UsersOverviewCardStub } from '@/features/staff/admin/components/cards/UsersOverviewCard/UsersOverviewCard.stub'

const mockIsBelowLg = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isBelowLg: mockIsBelowLg }),
  }
})

BddTest().given('a users overview list', () => {
  let wrapper: VueWrapper<InstanceType<typeof UsersOverviewList>>

  const mockUser: UserInfoType = {
    id: 'user-1',
    firstName: 'ALICE',
    lastName: 'DUPONT',
    email: 'alice.dupont@example.com',
  }

  const rows: UsersListRow[] = [
    {
      id: 'user-1',
      user: mockUser,
      institutions: [],
      formations: [
        { id: 'formation-1', name: 'Formation 1', type: EGroupType.PROGRAM, usersCount: 0 },
        { id: 'formation-2', name: 'Formation 2', type: EGroupType.PROGRAM, usersCount: 0 },
      ],
      groups: [
        { id: 'group-1', name: 'Groupe 1', type: EGroupType.STUDENT_GROUP, usersCount: 0 },
        { id: 'group-2', name: 'Groupe 2', type: EGroupType.STUDENT_GROUP, usersCount: 0 },
      ],
    },
    {
      id: 'user-2',
      user: { ...mockUser, id: 'user-2', firstName: 'BOB' },
      institutions: [],
      formations: [
        { id: 'formation-3', name: 'Formation 3', type: EGroupType.PROGRAM, usersCount: 0 },
      ],
      groups: [],
    },
  ]

  const columns: AvTableColumn<UsersListRow>[] = [
    { key: 'user', label: 'Utilisateurs', width: '40%' },
    { key: 'formations', label: 'Formations', width: '30%' },
    { key: 'groups', label: 'Groupes', width: '30%' },
  ]

  const stubs = {
    AvTable: AvTableStub,
    UserName: UserNameStub,
    GroupName: GroupNameStub,
    UsersOverviewCard: UsersOverviewCardStub,
  }

  const mountWith = async (options: {
    belowLg?: boolean
    rows?: UsersListRow[]
    columns?: AvTableColumn<UsersListRow>[]
  } = {}) => {
    const {
      belowLg = false,
      rows: rowsProp = rows,
      columns: columnsProp = columns,
    } = options

    mockIsBelowLg.value = belowLg

    wrapper = mountComponent(UsersOverviewList, {
      props: {
        rows: rowsProp,
        columns: columnsProp,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getTable = () => wrapper.findComponent(AvTableStub)
  const getCardsContainer = () => wrapper.find('[data-testid="users-overview-list-cards"]')
  const getCards = () => wrapper.findAllComponents(UsersOverviewCardStub)
  const getUserNames = () => wrapper.findAllComponents(UserNameStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsBelowLg.value = false
  })

  BddTest().when('the screen is at least the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the table instead of the cards', () => {
      expect(getTable().exists()).toBe(true)
      expect(wrapper.find('[data-testid="users-overview-list-table"]').exists()).toBe(true)
      expect(getCardsContainer().exists()).toBe(false)
    })

    BddTest().then('it should pass the rows and columns to the table', () => {
      expect(getTable().props('rows')).toEqual(rows)
      expect(getTable().props('columns')).toEqual(columns)
    })

    BddTest().then('it should use id as the row key', () => {
      expect(getTable().props('rowKey')).toBe('id')
    })

    BddTest().then('it should render user information with UserName and nav enabled', () => {
      expect(getUserNames()).toHaveLength(rows.length)
      expect(getUserNames()[0].props('user')).toEqual(rows[0].user)
      expect(getUserNames()[0].props('withNav')).toBe(true)
      expect(getUserNames()[1].props('user')).toEqual(rows[1].user)
      expect(getUserNames()[1].props('withNav')).toBe(true)
    })

    BddTest().then('it should render formations in the table slot with GroupName', () => {
      const formationsLists = wrapper.findAll('[data-testid="formations-list"]')
      expect(formationsLists).toHaveLength(2)
      const firstRowFormations = formationsLists[0].findAllComponents(GroupNameStub)
      expect(firstRowFormations).toHaveLength(2)
      expect(firstRowFormations[0].props('group')).toEqual(rows[0].formations?.[0])
      expect(firstRowFormations[0].props('withNav')).toBe(true)
      expect(firstRowFormations[1].props('group')).toEqual(rows[0].formations?.[1])
      expect(firstRowFormations[1].props('withNav')).toBe(true)
    })

    BddTest().then('it should render groups in the table slot with GroupName', () => {
      const groupsLists = wrapper.findAll('[data-testid="groups-list"]')
      expect(groupsLists).toHaveLength(1)
      const firstRowGroups = groupsLists[0].findAllComponents(GroupNameStub)
      expect(firstRowGroups).toHaveLength(2)
      expect(firstRowGroups[0].props('group')).toEqual(rows[0].groups?.[0])
      expect(firstRowGroups[0].props('withNav')).toBe(true)
      expect(firstRowGroups[1].props('group')).toEqual(rows[0].groups?.[1])
      expect(firstRowGroups[1].props('withNav')).toBe(true)
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

    BddTest().then('it should render one card per user', () => {
      expect(getCards()).toHaveLength(rows.length)
    })

    BddTest().then('it should pass each user to its card', () => {
      expect(getCards()[0].props('user')).toEqual(rows[0].user)
      expect(getCards()[0].props('formations')).toEqual(rows[0].formations)
      expect(getCards()[0].props('groups')).toEqual(rows[0].groups)
      expect(getCards()[1].props('user')).toEqual(rows[1].user)
      expect(getCards()[1].props('formations')).toEqual(rows[1].formations)
      expect(getCards()[1].props('groups')).toEqual(rows[1].groups)
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
