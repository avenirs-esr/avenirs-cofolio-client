import type { VueWrapper } from '@vue/test-utils'
import type { GroupDTO } from '@/api/avenir-esr'
import { AvIconTextStub, AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { EGroupType } from '@/api/avenir-esr'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { GroupTypeBadgeStub } from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.stub'
import { GroupNameStub } from '@/features/staff/admin/components/base/GroupName/GroupName.stub'
import { GroupParentNameStub } from '@/features/staff/admin/components/base/GroupParentName/GroupParentName.stub'
import { GroupCardStub } from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/cards/GroupCard/GroupCard.stub'
import GroupMainInfo from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/dataDisplay/GroupMainInfo/GroupMainInfo.vue'

const mockIsBelowLg = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({
      isBelowLg: mockIsBelowLg,
    }),
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
      type: EGroupType.PROGRAM,
    },
    name: 'Groupe A',
    type: EGroupType.PROGRAM,
    usersCount: 12,
  }

  const stubs = {
    AvTable: AvTableStub,
    AvIconText: AvIconTextStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    GroupName: GroupNameStub,
    GroupTypeBadge: GroupTypeBadgeStub,
    GroupParentName: GroupParentNameStub,
    GroupCard: GroupCardStub,
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
      await mountWith()
    })

    BddTest().then('it should render the information container and table', () => {
      expect(wrapper.findComponent(IconTitleCardContainerStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvTableStub).exists()).toBe(true)
      expect(wrapper.find('[data-testid="group-main-info-table"]').exists()).toBe(true)
      expect(wrapper.findComponent(GroupCardStub).exists()).toBe(false)
    })

    BddTest().then('it should pass the expected row to the table', () => {
      const table = wrapper.findComponent(AvTableStub)

      expect(table.props('rows')).toEqual([{
        ...group,
        institutionName: 'Université A',
        parentName: 'Groupe parent',
      }])
      expect(table.props('rowKey')).toBe('id')
    })

    BddTest().then('it should define the expected table columns', () => {
      const columns = wrapper.findComponent(AvTableStub).props('columns') as Array<{
        key: string
        label: string
        width?: string
      }>

      expect(columns).toHaveLength(5)
      expect(columns.map(column => column.key)).toEqual([
        'name',
        'type',
        'institutionName',
        'parentName',
        'usersCount',
      ])
      expect(columns.every(column => typeof column.label === 'string')).toBe(true)
      expect(columns.map(column => column.width)).toEqual([
        '30%',
        '20%',
        '20%',
        '20%',
        '10%',
      ])
    })
  })

  BddTest().when('the screen is below the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith(true)
    })

    BddTest().then('it should render the detailed group card instead of the table', () => {
      expect(wrapper.findComponent(GroupCardStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvTableStub).exists()).toBe(false)
      expect(wrapper.find('[data-testid="group-main-info-table"]').exists()).toBe(false)
    })

    BddTest().then('it should pass the group to the detailed group card', () => {
      expect(wrapper.findComponent(GroupCardStub).props('group')).toEqual(group)
    })
  })

  BddTest().when('the group has no institution or parent', () => {
    beforeEach(async () => {
      const groupWithoutRelations: GroupDTO = {
        ...group,
        institution: undefined as unknown as GroupDTO['institution'],
        parent: undefined,
      }

      mockIsBelowLg.value = false
      wrapper = mountComponent(GroupMainInfo, {
        props: { group: groupWithoutRelations },
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should use empty strings for missing institution and parent names', () => {
      const rows = wrapper.findComponent(AvTableStub).props('rows')

      expect(rows).toEqual([{
        ...group,
        institution: undefined,
        parent: undefined,
        institutionName: '',
        parentName: '',
      }])
    })
  })
})
