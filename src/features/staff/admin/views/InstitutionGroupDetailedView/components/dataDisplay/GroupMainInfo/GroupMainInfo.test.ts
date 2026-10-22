import type { VueWrapper } from '@vue/test-utils'
import type { GroupDTO } from '@/api/avenir-esr'
import { AvIconTextStub, AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { EGroupType } from '@/api/avenir-esr'
import { GroupTypeBadgeStub } from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.stub'
import { GroupNameStub } from '@/features/staff/admin/components/base/GroupName/GroupName.stub'
import { GroupParentNameStub } from '@/features/staff/admin/components/base/GroupParentName/GroupParentName.stub'
import { DetailedGroupCardStub } from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/cards/DetailedGroupCard/DetailedGroupCard.stub'
import DetailedGroupCard from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/cards/DetailedGroupCard/DetailedGroupCard.vue'
import GroupMainInfo from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/dataDisplay/GroupMainInfo/GroupMainInfo.vue'

const mockIsBelowLg = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({
      isBelowLg: mockIsBelowLg,
    })
  }
})

BddTest().given('a group main info component', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupMainInfo>>

  const group: GroupDTO = {
    id: 'group-1',
    institution: {
      id: 'institution-1',
      name: 'Université A',
    },
    parent: {
      id: 'parent-1',
      name: 'Groupe parent',
      type: EGroupType.PROGRAM
    },
    name: 'Groupe A',
    type: EGroupType.PROGRAM,
    usersCount: 12,
  }

  const stubs = {
    AvTable: AvTableStub,
    AvIconText: AvIconTextStub,
    GroupName: GroupNameStub,
    GroupTypeBadge: GroupTypeBadgeStub,
    GroupParentName: GroupParentNameStub,
    DetailedGroupCard: DetailedGroupCardStub,
  }

  const mountWith = async (belowLg = false) => {
    mockIsBelowLg.value = belowLg

    wrapper = mountComponent(GroupMainInfo, {
      props: { group },
      global: { stubs },
    })

    await flushPromises()
  }

  BddTest().when('the screen is at least the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith(false)
    })

    BddTest().then('it should render the group information table', () => {
      expect(wrapper.findComponent(AvTableStub).exists()).toBe(true)
      expect(wrapper.find('[data-testid="group-main-info-table"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="detailed-group-card"]').exists()).toBe(false)
    })

    BddTest().then('it should pass the group as the only table row', () => {
      const table = wrapper.findComponent(AvTableStub)

      expect(table.props('rows')).toEqual([group])
      expect(table.props('rowKey')).toBe('id')
    })

    BddTest().then('it should define the expected table columns', () => {
      const columns = wrapper.findComponent(AvTableStub).props('columns') as Array<{ key: string, label: string }>

      expect(columns).toHaveLength(5)
      expect(columns?.map(column => column.key)).toEqual([
        'name',
        'type',
        'institutionName',
        'parentName',
        'usersCount',
      ])
      expect(columns?.every(column => typeof column.label === 'string')).toBe(true)
    })
  })

  BddTest().when('the screen is below the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith(true)
    })

    BddTest().then('it should render the detailed group card instead of the table', () => {
      expect(wrapper.find('[data-testid="detailed-group-card"]').exists()).toBe(true)
      expect(wrapper.findComponent(DetailedGroupCard).exists()).toBe(true)
      expect(wrapper.findComponent(AvTableStub).exists()).toBe(false)
    })

    BddTest().then('it should pass the group to the detailed group card', () => {
      expect(wrapper.findComponent(DetailedGroupCard).props('group')).toEqual(group)
    })
  })
})
