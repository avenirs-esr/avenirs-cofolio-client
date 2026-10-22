import type { VueWrapper } from '@vue/test-utils'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { expect, vi } from 'vitest'
import { mockGroupOverview, mockGroupOverviewWithParent } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { EGroupType } from '@/api/avenir-esr'
import GroupParentName from '@/features/staff/admin/components/base/GroupParentName/GroupParentName.vue'

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

BddTest().given('a group parent name', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupParentName>>

  const stubs = { AvTooltip: AvTooltipStub, RouterLink: RouterLinkStub }

  const mountWith = (withNav: boolean, group = mockGroupOverview) => wrapper = mount(GroupParentName, {
    props: { group, withNav },
    global: { stubs },
  })

  const getAvTooltip = () => wrapper.findComponent(AvTooltipStub)
  const getParentName = () => wrapper.find('[data-testid="parent-name"]')
  const getContainer = () => wrapper.find('[data-testid="group-parent-name"]')

  beforeEach(() => {
    mockIsTruncated.value = false
  })

  BddTest().when('the group has no parent and nav is activated', () => {
    beforeEach(() => {
      mountWith(true, {
        ...mockGroupOverview,
        parent: undefined,
      })
    })

    BddTest().then('it should not render the parent group container', () => {
      expect(getContainer().exists()).toBe(false)
    })

    BddTest().then('it should not display the parent group name', () => {
      expect(getParentName().exists()).toBe(false)
    })
  })

  BddTest().when('the group has a parent with a name and nav is activated', () => {
    beforeEach(() => {
      mountWith(true, mockGroupOverviewWithParent)
    })

    BddTest().then('it should expose the parent group id', () => {
      expect(getContainer().attributes('data-group-id')).toBe(mockGroupOverviewWithParent.parent?.id)
    })

    BddTest().then('it should display the parent group name', () => {
      expect(getParentName().text()).toBe(mockGroupOverviewWithParent.parent?.name)
    })

    BddTest().then('it should pass the parent name as tooltip content', () => {
      expect(getAvTooltip().props('content')).toBe(mockGroupOverviewWithParent.parent?.name)
    })

    BddTest().then('it should disable the tooltip when the name is not truncated', () => {
      expect(getAvTooltip().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the parent name is truncated and nav is activated', () => {
    beforeEach(() => {
      mockIsTruncated.value = true
      mountWith(true, mockGroupOverviewWithParent)
    })

    BddTest().then('it should enable the tooltip', () => {
      expect(getAvTooltip().props('disabled')).toBe(false)
    })
  })

  BddTest().when('the group has parent and nav is activated', () => {
    beforeEach(() => {
      mountWith(true, {
        ...mockGroupOverview,
        parent: {
          id: 'parent-id',
          name: 'Parent Name',
          type: EGroupType.PROGRAM
        },
      })
    })

    BddTest().then('it should render the parent container', () => {
      expect(getContainer().exists()).toBe(true)
    })

    BddTest().then('it should display the parent name', () => {
      expect(getParentName().text()).toBe('Parent Name')
    })
  })
})
