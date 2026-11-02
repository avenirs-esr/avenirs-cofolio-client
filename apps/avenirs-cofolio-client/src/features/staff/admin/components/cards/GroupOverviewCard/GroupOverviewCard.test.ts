import type { VueWrapper } from '@vue/test-utils'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from '@avenirs-esr/shared/test-utils/unit'
import { RouterLinkStub } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockGroupOverview, mockGroupOverviewWithParent } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ROUTES } from '@/common/constants'
import { GroupTypeBadgeStub } from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.stub'
import GroupOverviewCard from '@/features/staff/admin/components/cards/GroupOverviewCard/GroupOverviewCard.vue'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useTextTruncation: () => ({ isTruncated: mockIsTruncated }),
  }
})

BddTest().given('a group overview card', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupOverviewCard>>

  const stubs = {
    AvTooltip: AvTooltipStub,
    RouterLink: RouterLinkStub,
    Card: CardStub,
    GroupTypeBadge: GroupTypeBadgeStub,
  }

  const mountWith = async (
    group = mockGroupOverview,
    isSubGroup = false,
  ) => {
    wrapper = await mountWithRouter<typeof GroupOverviewCard>(GroupOverviewCard, {
      props: { group, isSubGroup },
      global: { stubs },
    })
  }

  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getCard = () => wrapper.find('[data-testid="group-overview-card"]')
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
        name: ROUTES.STAFF.ADMIN.GROUP.DEFAULT.name,
        params: { id: mockGroupOverview.id },
      })
    })

    BddTest().then('it should display the group type badge', () => {
      expect(wrapper.find('[data-testid="group-type-badge"]').exists()).toBe(true)
    })

    BddTest().then('it should display the users count', () => {
      expect(getUsersCount().text()).toContain(String(mockGroupOverview.usersCount))
    })

    BddTest().then('it should not display the parent name when the group has no parent', () => {
      expect(getParentName().exists()).toBe(false)
      expect(getTooltips()).toHaveLength(1)
    })

    BddTest().then('it should disable the name tooltip when the name is not truncated', () => {
      expect(getTooltips()[0].props('disabled')).toBe(true)
    })

    BddTest().then('it should display the users count when the group is not a subgroup', () => {
      expect(getUsersCount().exists()).toBe(true)
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

  BddTest().when('the group has a parent', () => {
    beforeEach(async () => {
      await mountWith(mockGroupOverviewWithParent)
    })

    BddTest().then('it should display the parent name', () => {
      expect(getParentName().text()).toContain(mockGroupOverviewWithParent.parent?.name)
    })

    BddTest().then('it should pass the parent name as tooltip content', () => {
      expect(getTooltips()[1].props('content')).toBe(mockGroupOverviewWithParent.parent?.name)
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

  BddTest().when('the component is rendered as a subgroup', () => {
    beforeEach(async () => {
      await mountWith(mockGroupOverviewWithParent, true)
    })

    BddTest().then('it should display the group name', () => {
      expect(getName().text()).toBe(mockGroupOverviewWithParent.name)
    })

    BddTest().then('it should link to the group detail page', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.ADMIN.GROUP.DEFAULT.name,
        params: { id: mockGroupOverviewWithParent.id },
      })
    })

    BddTest().then('it should not display the parent name', () => {
      expect(getParentName().exists()).toBe(false)
    })

    BddTest().then('it should not display the users count', () => {
      expect(getUsersCount().exists()).toBe(false)
    })

    BddTest().then('it should only display the name tooltip', () => {
      expect(getTooltips()).toHaveLength(1)
      expect(getTooltips()[0].props('content')).toBe(mockGroupOverviewWithParent.name)
    })
  })
})
