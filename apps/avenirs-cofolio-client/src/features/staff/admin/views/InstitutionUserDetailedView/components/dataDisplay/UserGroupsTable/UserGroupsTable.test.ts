import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { EGroupType } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import GroupTypeBadge from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.vue'
import GroupName from '@/features/staff/admin/components/base/GroupName/GroupName.vue'
import { getUserGroupsByType, getUserGroupsByTypeExcluding } from '@/features/staff/admin/utils/groups.utils'
import UserGroupsTable from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserGroupsTable/UserGroupsTable.vue'

const mockIsBelowLg = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isBelowLg: mockIsBelowLg }),
  }
})

BddTest().given('a user groups table', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserGroupsTable>>

  const user = mockExternalUserDetail

  const stubs = {
    AvTable: AvTableStub,
    Card: CardStub,
  }

  const mountWith = async (options?: {
    belowLg?: boolean
    programMode?: boolean
    customUser?: ExternalUserDetailDTO
  }) => {
    mockIsBelowLg.value = options?.belowLg ?? false

    wrapper = mountComponent(UserGroupsTable, {
      props: {
        user: options?.customUser ?? user,
        programMode: options?.programMode ?? false,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getTable = () => wrapper.findComponent(AvTableStub)
  const getCardsContainer = () => wrapper.find('[data-testid="users-overview-list-cards"]')
  const getCards = () => wrapper.findAllComponents(CardStub)
  const getGroupNames = () => wrapper.findAllComponents(GroupName)
  const getGroupTypeBadges = () => wrapper.findAllComponents(GroupTypeBadge)

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsBelowLg.value = false
  })

  BddTest().when('the screen is at least the large breakpoint and program mode is disabled', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the table instead of the cards', () => {
      expect(getTable().exists()).toBe(true)
      expect(wrapper.find('[data-testid="users-overview-list-table"]').exists()).toBe(true)
      expect(getCardsContainer().exists()).toBe(false)
    })

    BddTest().then('it should display all groups except programs', () => {
      expect(getTable().props('rows')).toEqual(getUserGroupsByTypeExcluding(user, EGroupType.PROGRAM).map(group => ({
        id: group.id,
        groupName: group.name,
        groupeType: group.type,
      })))
    })

    BddTest().then('it should pass the expected columns to the table', () => {
      const columns = getTable().props('columns') as AvTableColumn<{
        id: string
        groupName: string
        groupeType?: EGroupType
      }>[]

      expect(columns.map(column => column.key)).toEqual(['groupName', 'groupeType'])
      expect(columns.every(column => Boolean(column.label))).toBe(true)
      expect(columns.map(column => column.width)).toEqual(['75%', '25%'])
    })

    BddTest().then('it should use id as the row key', () => {
      expect(getTable().props('rowKey')).toBe('id')
    })
  })

  BddTest().when('the screen is at least the large breakpoint and program mode is enabled', () => {
    beforeEach(async () => {
      await mountWith({ programMode: true })
    })

    BddTest().then('it should display only program groups', () => {
      expect(getTable().props('rows')).toEqual(getUserGroupsByType(user, EGroupType.PROGRAM).map(group => ({
        id: group.id,
        groupName: group.name,
      })))
    })

    BddTest().then('it should display only the group name column', () => {
      const columns = getTable().props('columns') as AvTableColumn<{
        id: string
        groupName: string
        groupeType?: EGroupType
      }>[]

      expect(columns.map(column => column.key)).toEqual(['groupName'])
      expect(columns[0].width).toBe('75%')
      expect(columns[0].label).toBeTruthy()
    })
  })

  BddTest().when('the screen is below the large breakpoint and program mode is disabled', () => {
    beforeEach(async () => {
      await mountWith({ belowLg: true })
    })

    BddTest().then('it should render cards instead of the table', () => {
      expect(getCardsContainer().exists()).toBe(true)
      expect(getCards()).toHaveLength(2)
      expect(getTable().exists()).toBe(false)
    })

    BddTest().then('it should render the name of each group', () => {
      expect(getGroupNames()).toHaveLength(2)
      expect(getGroupNames().map(groupName => groupName.props('group').id)).toEqual([
        'option-1',
        'student-group-1',
      ])
    })

    BddTest().then('it should render a type badge for each group', () => {
      expect(getGroupTypeBadges()).toHaveLength(2)
      expect(getGroupTypeBadges().map(badge => badge.props('type'))).toEqual([
        EGroupType.PROGRAM_OPTION,
        EGroupType.STUDENT_GROUP,
      ])
    })
  })

  BddTest().when('the screen is below the large breakpoint and program mode is enabled', () => {
    beforeEach(async () => {
      await mountWith({ belowLg: true, programMode: true })
    })

    BddTest().then('it should render a card for each program group', () => {
      expect(getCards()).toHaveLength(1)
      expect(getGroupNames()).toHaveLength(1)
      expect(getGroupNames()[0].props('group').id).toBe('program-1')
    })

    BddTest().then('it should not render group type badges', () => {
      expect(getGroupTypeBadges()).toHaveLength(0)
    })
  })

  BddTest().when('the user has no groups', () => {
    beforeEach(async () => {
      await mountWith({
        customUser: { ...user, groups: [] },
      })
    })

    BddTest().then('it should render an empty table', () => {
      expect(getTable().props('rows')).toEqual([])
    })
  })

  BddTest().when('the user has no program groups and program mode is enabled', () => {
    beforeEach(async () => {
      await mountWith({
        programMode: true,
        customUser: {
          ...user,
          groups: user.groups.filter(group => group.type !== EGroupType.PROGRAM),
        },
      })
    })

    BddTest().then('it should render an empty table', () => {
      expect(getTable().props('rows')).toEqual([])
    })
  })
})
