import type { VueWrapper } from '@vue/test-utils'
import type { GroupDTO } from '@/api/avenir-esr'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockGroup } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { GroupTypeBadgeStub } from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.stub'
import { GroupParentNameStub } from '@/features/staff/admin/components/base/GroupParentName/GroupParentName.stub'
import GroupCard from '@/features/staff/admin/views/InstitutionGroupDetailedView/components/cards/GroupCard/GroupCard.vue'

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

  const groupWithoutParent: GroupDTO = {
    ...mockGroup,
    parent: undefined,
  }

  const groupWithParent: GroupDTO = {
    ...mockGroup,
    parent: {
      id: 'parent-id',
      name: 'Groupe parent',
      type: mockGroup.type,
    },
  }

  const stubs = {
    Card: CardStub,
    AvTooltip: AvTooltipStub,
    GroupTypeBadge: GroupTypeBadgeStub,
    GroupParentName: GroupParentNameStub,
  }

  const mountWith = async (group = groupWithoutParent) => {
    mockIsTruncated.value = false

    wrapper = mountComponent(GroupCard, {
      props: { group },
      global: { stubs },
    })

    await flushPromises()
  }

  const getCard = () => wrapper.findComponent(CardStub)
  const getName = () => wrapper.find('[data-testid="name"]')
  const getInstitutionName = () => wrapper.find('[data-testid="institution-name"]')
  const getParentName = () => wrapper.find('[data-testid="parent-name"]')
  const getUsersCount = () => wrapper.find('[data-testid="users-count"]')
  const getTooltips = () => wrapper.findAllComponents(AvTooltipStub)

  beforeEach(async () => {
    await mountWith()
  })

  BddTest().when('the group has no parent', () => {
    BddTest().then('it should render the card with the group id', () => {
      expect(getCard().exists()).toBe(true)
      expect(getCard().attributes('data-group-id')).toBe(groupWithoutParent.id)
    })

    BddTest().then('it should display the group name', () => {
      expect(getName().text()).toBe(groupWithoutParent.name)
    })

    BddTest().then('it should display the institution name', () => {
      expect(getInstitutionName().text()).toContain(groupWithoutParent.institution.name)
    })

    BddTest().then('it should display the group type badge', () => {
      expect(wrapper.findComponent(GroupTypeBadgeStub).props('type'))
        .toBe(groupWithoutParent.type)
    })

    BddTest().then('it should not display the parent name', () => {
      expect(getParentName().exists()).toBe(false)
      expect(wrapper.findComponent(GroupParentNameStub).exists()).toBe(false)
    })

    BddTest().then('it should display the users count', () => {
      expect(getUsersCount().text()).toContain(String(groupWithoutParent.usersCount))
    })

    BddTest().then('it should render a tooltip for the group name and institution', () => {
      expect(getTooltips()).toHaveLength(2)
      expect(getTooltips()[0].props('content')).toBe(groupWithoutParent.name)
      expect(getTooltips()[1].props('content')).toBe(groupWithoutParent.institution.name)
    })

    BddTest().then('it should disable both tooltips when the texts are not truncated', () => {
      expect(getTooltips().map(tooltip => tooltip.props('disabled')))
        .toStrictEqual([true, true])
    })
  })

  BddTest().when('the group has a parent', () => {
    beforeEach(async () => {
      await mountWith(groupWithParent)
    })

    BddTest().then('it should display the parent name label', () => {
      expect(getParentName().exists()).toBe(true)
    })

    BddTest().then('it should display the parent group component with navigation', () => {
      const parentName = wrapper.findComponent(GroupParentNameStub)

      expect(parentName.exists()).toBe(true)
      expect(parentName.props('group')).toStrictEqual(groupWithParent)
      expect(parentName.props('withNav')).toBe(true)
    })
  })

  BddTest().when('the texts are truncated', () => {
    beforeEach(async () => {
      await mountWith()
      mockIsTruncated.value = true
    })

    BddTest().then('it should enable both tooltips', () => {
      expect(getTooltips().map(tooltip => tooltip.props('disabled')))
        .toStrictEqual([false, false])
    })
  })
})
