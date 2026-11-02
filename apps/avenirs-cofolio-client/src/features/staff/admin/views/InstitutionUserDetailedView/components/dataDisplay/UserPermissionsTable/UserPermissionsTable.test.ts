import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { EAuthorizationEntityType } from '@/api/avenir-esr'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { ERole } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import UserRoleBadge from '@/features/staff/admin/components/badges/UserRoleBadge/UserRoleBadge.vue'
import UserPermissionsTable from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserPermissionsTable/UserPermissionsTable.vue'

const mockIsBelowLg = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isBelowLg: mockIsBelowLg }),
  }
})

BddTest().given('a user permissions table', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserPermissionsTable>>

  const roles = [ERole.ROLE_ADMIN, ERole.ROLE_USER_BASE]

  const stubs = {
    AvTable: AvTableStub,
    Card: CardStub,
  }

  const mountWith = async (options: {
    belowLg?: boolean
    customRoles?: ERole[]
  } = {}) => {
    mockIsBelowLg.value = options.belowLg ?? false

    wrapper = mountComponent(UserPermissionsTable, {
      props: {
        roles: options.customRoles ?? roles,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getTable = () => wrapper.findComponent(AvTableStub)
  const getCardsContainer = () => wrapper.find('[data-testid="user-permissions-cards"]')
  const getCards = () => wrapper.findAllComponents(CardStub)
  const getRoleBadges = () => wrapper.findAllComponents(UserRoleBadge)

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
      expect(wrapper.find('[data-testid="user-permissions-table"]').exists()).toBe(true)
      expect(getCardsContainer().exists()).toBe(false)
    })

    BddTest().then('it should display a row for each role', () => {
      expect(getTable().props('rows')).toEqual([
        {
          id: roles[0],
          name: expect.any(String),
          description: expect.any(String),
        },
        {
          id: roles[1],
          name: expect.any(String),
          description: expect.any(String),
        },
      ])
    })

    BddTest().then('it should pass the expected columns to the table', () => {
      const columns = getTable().props('columns') as AvTableColumn<{
        id: ERole
        name: string
        description: string
        type?: EAuthorizationEntityType
      }>[]

      expect(columns.map(column => column.key)).toEqual([
        'name',
        'description',
      ])
      expect(columns.every(column => Boolean(column.label))).toBe(true)
      expect(columns.map(column => column.width)).toEqual(['30%', '70%'])
    })

    BddTest().then('it should use id as the row key', () => {
      expect(getTable().props('rowKey')).toBe('id')
    })

    BddTest().then('it should render a role badge for each row', () => {
      expect(getRoleBadges()).toHaveLength(roles.length)
      expect(getRoleBadges().map(badge => badge.props('role'))).toEqual(roles)
    })
  })

  BddTest().when('the screen is below the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith({ belowLg: true })
    })

    BddTest().then('it should render cards instead of the table', () => {
      expect(getCardsContainer().exists()).toBe(true)
      expect(getCards()).toHaveLength(roles.length)
      expect(getTable().exists()).toBe(false)
    })

    BddTest().then('it should render a role badge for each card', () => {
      expect(getRoleBadges()).toHaveLength(roles.length)
      expect(getRoleBadges().map(badge => badge.props('role'))).toEqual(roles)
    })

    BddTest().then('it should render the description for each role', () => {
      const descriptions = wrapper.findAll('[data-testid="permission-description"]')

      expect(descriptions).toHaveLength(roles.length)
      expect(descriptions.every(description => description.text().length > 0)).toBe(true)
    })
  })

  BddTest().when('the user has no roles', () => {
    beforeEach(async () => {
      await mountWith({ customRoles: [] })
    })

    BddTest().then('it should render an empty table', () => {
      expect(getTable().props('rows')).toEqual([])
    })
  })

  BddTest().when('the user has no roles and the screen is below the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith({
        belowLg: true,
        customRoles: [],
      })
    })

    BddTest().then('it should render an empty cards container', () => {
      expect(getCardsContainer().exists()).toBe(true)
      expect(getCards()).toHaveLength(0)
    })
  })
})
