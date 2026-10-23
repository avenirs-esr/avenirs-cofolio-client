import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { UsersListRow } from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.types'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, RouterLinkStub } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ROUTES } from '@/common/constants'
import { UserInfoStub } from '@/features/staff/admin/components/base/UserInfo/UserInfo.stub'
import UsersOverviewList from '@/features/staff/admin/components/base/UsersOverviewList/UsersOverviewList.vue'

const mockIsBelowLg = ref(false)

const route = reactive<{ name: string, params: Record<string, string> }>({
  name: ROUTES.STAFF.ADMIN.USER.name,
  params: {} as Record<string, string>,
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => route,
  }
})

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
    profilePictureId: undefined,
  }

  const rows = [
    { id: 'user-1', user: mockUser },
    {
      id: 'user-2',
      user: { ...mockUser, id: 'user-2', firstName: 'BOB' },
    },
  ] as UsersListRow[]

  const columns: AvTableColumn<UsersListRow>[] = [
    { key: 'user', label: 'Utilisateur(rice)', width: '95%' },
    { key: 'actions', label: 'Actions', width: '5%' },
  ]

  const AvButtonStub = {
    props: ['label', 'icon', 'iconOnly', 'size', 'to'],
    template: '<button>{{ label }}</button>',
  }

  const stubs = {
    AvTable: AvTableStub,
    AvButton: AvButtonStub,
    Card: CardStub,
    UserInfo: UserInfoStub,
    RouterLink: RouterLinkStub,
  }

  const mountWith = async (options: {
    belowLg?: boolean
    rows?: UsersListRow[]
    columns?: AvTableColumn<UsersListRow>[]
    routeName?: string
    routeParams?: Record<string, string>
  } = {}) => {
    const {
      belowLg = false,
      rows: rowsProp = rows,
      columns: columnsProp = columns,
      routeName = ROUTES.STAFF.ADMIN.USER.name,
      routeParams = {},
    } = options

    mockIsBelowLg.value = belowLg
    route.name = routeName
    route.params = routeParams

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
  const getCards = () => wrapper.findAllComponents(CardStub)
  const getUserInfos = () => wrapper.findAllComponents(UserInfoStub)
  const getRouterLinks = () => wrapper.findAllComponents(RouterLinkStub)
  const getAvButtons = () => wrapper.findAllComponents(AvButtonStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsBelowLg.value = false
    route.name = ROUTES.STAFF.ADMIN.USER.name
    route.params = {}
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

    BddTest().then('it should render user information in the table slot', () => {
      expect(getUserInfos()).toHaveLength(rows.length)
      expect(getUserInfos()[0].props('user')).toEqual(rows[0].user)
      expect(getUserInfos()[1].props('user')).toEqual(rows[1].user)
    })

    BddTest().then('it should render an action button for each user', () => {
      expect(getAvButtons()).toHaveLength(rows.length)
    })

    BddTest().then('it should label each action button with the user full name', () => {
      expect(getAvButtons()[0].props('label')).toBe('Accéder au détail de Alice Dupont')
      expect(getAvButtons()[1].props('label')).toBe('Accéder au détail de Bob Dupont')
    })

    BddTest().then('it should configure the action buttons as icon-only large buttons', () => {
      for (const button of getAvButtons()) {
        expect(button.props('iconOnly')).toBeDefined()
        expect(button.props('size')).toBe('LG')
      }
    })

    BddTest().then('it should link action buttons to the user detail route', () => {
      expect(getAvButtons()[0].props('to')).toEqual({
        name: ROUTES.STAFF.ADMIN.USER.name,
        params: { userId: 'user-1', groupId: undefined },
      })
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

    BddTest().then('it should render user information in each card', () => {
      expect(getUserInfos()).toHaveLength(rows.length)
      expect(getUserInfos()[0].props('user')).toEqual(rows[0].user)
      expect(getUserInfos()[1].props('user')).toEqual(rows[1].user)
    })

    BddTest().then('it should render a link for each user', () => {
      expect(getRouterLinks()).toHaveLength(rows.length)
    })

    BddTest().then('it should link each card to the corresponding user detail', () => {
      expect(getRouterLinks()[0].props('to')).toEqual({
        name: ROUTES.STAFF.ADMIN.USER.name,
        params: { userId: 'user-1', groupId: undefined },
      })

      expect(getRouterLinks()[1].props('to')).toEqual({
        name: ROUTES.STAFF.ADMIN.USER.name,
        params: { userId: 'user-2', groupId: undefined },
      })
    })
  })

  BddTest().when('the list is displayed on the groups route', () => {
    const groupId = 'group-1'

    BddTest().and('the screen is at least the large breakpoint', () => {
      beforeEach(async () => {
        await mountWith({
          routeName: ROUTES.STAFF.ADMIN.GROUPS.name,
          routeParams: { id: groupId },
        })
      })

      BddTest().then('it should link the action button to the group user detail route', () => {
        expect(getAvButtons()[0].props('to')).toEqual({
          name: ROUTES.STAFF.ADMIN.GROUP.USER.name,
          params: { userId: 'user-1', groupId },
        })
      })
    })

    BddTest().and('the screen is below the large breakpoint', () => {
      beforeEach(async () => {
        await mountWith({
          belowLg: true,
          routeName: ROUTES.STAFF.ADMIN.GROUPS.name,
          routeParams: { id: groupId },
        })
      })

      BddTest().then('it should link each card to the group user detail route', () => {
        expect(getRouterLinks()[0].props('to')).toEqual({
          name: ROUTES.STAFF.ADMIN.GROUP.USER.name,
          params: { userId: 'user-1', groupId },
        })
      })
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
