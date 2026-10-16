import type { VueWrapper } from '@vue/test-utils'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect, vi } from 'vitest'
import { mockGroupOverview, mockGroupOverviewWithParent } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import GroupsListParentName from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsListParentName/GroupsListParentName.vue'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useTextTruncation: () => ({
      isTruncated: mockIsTruncated,
    }),
  }
})

BddTest().given('a group list parent name', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupsListParentName>>

  const stubs = { AvTooltip: AvTooltipStub }

  const mountWith = (group = mockGroupOverview) => wrapper = mount(GroupsListParentName, {
    props: { group },
    global: { stubs },
  })

  const getAvTooltip = () => wrapper.findComponent(AvTooltipStub)
  const getParentName = () => wrapper.find('[data-testid="parent-name"]')
  const getContainer = () => wrapper.find('[data-testid="group-list-table-parent-name"]')

  beforeEach(() => {
    mockIsTruncated.value = false
  })

  BddTest().when('the group has no parent', () => {
    beforeEach(() => {
      mountWith({
        ...mockGroupOverview,
        parentId: undefined,
        parentName: undefined,
      })
    })

    BddTest().then('it should not render the parent group container', () => {
      expect(getContainer().exists()).toBe(false)
    })

    BddTest().then('it should not display the parent group name', () => {
      expect(getParentName().exists()).toBe(false)
    })
  })

  BddTest().when('the group has a parent with a name', () => {
    beforeEach(() => {
      mountWith(mockGroupOverviewWithParent)
    })

    BddTest().then('it should expose the parent group id', () => {
      expect(getContainer().attributes('data-group-id')).toBe(mockGroupOverviewWithParent.parentId)
    })

    BddTest().then('it should display the parent group name', () => {
      expect(getParentName().text()).toBe(mockGroupOverviewWithParent.parentName)
    })

    BddTest().then('it should pass the parent name as tooltip content', () => {
      expect(getAvTooltip().props('content')).toBe(mockGroupOverviewWithParent.parentName)
    })

    BddTest().then('it should disable the tooltip when the name is not truncated', () => {
      expect(getAvTooltip().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the parent name is truncated', () => {
    beforeEach(() => {
      mockIsTruncated.value = true
      mountWith(mockGroupOverviewWithParent)
    })

    BddTest().then('it should enable the tooltip', () => {
      expect(getAvTooltip().props('disabled')).toBe(false)
    })
  })

  BddTest().when('the group has a parent without a name', () => {
    beforeEach(() => {
      mountWith({
        ...mockGroupOverview,
        parentId: 'parent-id',
      })
    })

    BddTest().then('it should render the parent container', () => {
      expect(getContainer().exists()).toBe(true)
    })

    BddTest().then('it should not render the tooltip or parent name', () => {
      expect(getAvTooltip().exists()).toBe(false)
      expect(getParentName().exists()).toBe(false)
    })
  })
})
