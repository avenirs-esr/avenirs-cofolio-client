import type { VueWrapper } from '@vue/test-utils'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockGroupOverview, mockGroupOverviewWithParent } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ROUTES } from '@/common/constants'
import { GroupTypeBadgeStub } from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/badges/GroupTypeBadge/GroupTypeBadge.stub'
import GroupCard from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/cards/GroupCard/GroupCard.vue'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useTextTruncation: () => ({ isTruncated: mockIsTruncated }),
  }
})

BddTest().given('a group card', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupCard>>

  const stubs = {
    AvTooltip: AvTooltipStub,
    RouterLink: RouterLinkStub,
    Card: CardStub,
    GroupTypeBadge: GroupTypeBadgeStub,
  }

  const mountWith = async (group = mockGroupOverview) => {
    wrapper = await mountWithRouter<typeof GroupCard>(GroupCard, {
      props: { group },
      global: { stubs },
    })
  }

  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getCard = () => wrapper.find('[data-testid="group-card"]')
  const getName = () => wrapper.find('[data-testid="name"]')
  const getParentName = () => wrapper.find('[data-testid="parent-name"]')
  const getUsersCount = () => wrapper.find('[data-testid="users-count"]')
  const getTooltips = () => wrapper.findAllComponents(AvTooltipStub)

  beforeEach(() => {
    mockIsTruncated.value = false
  })

  BddTest().when('the component is rendered', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should display the group name', () => {
      expect(getName().text()).toBe(mockGroupOverview.name)
    })

    BddTest().then('it should expose the group id on the card', () => {
      expect(getCard().attributes('data-group-id')).toBe(mockGroupOverview.id)
    })

    BddTest().then('it should link to the group detail page', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.ADMIN.GROUP.name,
        params: { id: mockGroupOverview.id },
      })
    })

    BddTest().then('it should display the group type badge', () => {
      expect(wrapper.find('[data-testid="group-type-badge"]').exists()).toBe(true)
    })

    BddTest().then('it should display the users count', () => {
      expect(getUsersCount().text()).toContain(String(mockGroupOverview.usersCount))
    })

    BddTest().then('it should not display the parent name when the group has no parent name', () => {
      expect(getParentName().exists()).toBe(false)
      expect(getTooltips()).toHaveLength(1)
    })

    BddTest().then('it should disable the name tooltip when the name is not truncated', () => {
      expect(getTooltips()[0].props('disabled')).toBe(true)
    })
  })

  BddTest().when('the group name is truncated', () => {
    beforeEach(async () => {
      mockIsTruncated.value = true
      await mountWith()
    })

    BddTest().then('it should enable the name tooltip', () => {
      expect(getTooltips()[0].props('disabled')).toBe(false)
    })
  })

  BddTest().when('the group has a parent name', () => {
    beforeEach(async () => {
      await mountWith(mockGroupOverviewWithParent)
    })

    BddTest().then('it should display the parent name', () => {
      expect(getParentName().text()).toContain(mockGroupOverviewWithParent.parentName)
    })

    BddTest().then('it should pass the parent name as tooltip content', () => {
      expect(getTooltips()[1].props('content')).toBe(mockGroupOverviewWithParent.parentName)
    })

    BddTest().then('it should disable the parent name tooltip when the name is not truncated', () => {
      expect(getTooltips()[1].props('disabled')).toBe(true)
    })

    BddTest().then('it should display both tooltips', () => {
      expect(getTooltips()).toHaveLength(2)
    })
  })

  BddTest().when('the parent name is truncated', () => {
    beforeEach(async () => {
      mockIsTruncated.value = true
      await mountWith(mockGroupOverviewWithParent)
    })

    BddTest().then('it should enable the parent name tooltip', () => {
      expect(getTooltips()[1].props('disabled')).toBe(false)
    })
  })
})
