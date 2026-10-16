import { mockGroupOverview } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { ROUTES } from '@/common/constants'
import GroupsListName from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsListName/GroupsListName.vue'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { expect, vi } from 'vitest'

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

BddTest().given('a group list name', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupsListName>>

  const stubs = { AvTooltip: AvTooltipStub, RouterLink: RouterLinkStub }

  const mountWith = async (group = mockGroupOverview) => wrapper = await mountWithRouter<typeof GroupsListName>(GroupsListName, {
    props: { group },
    global: { stubs },
  })

  const getAvTooltip = () => wrapper.findComponent(AvTooltipStub)
  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getNameLink = () => wrapper.get('[data-testid="group-list-table-name-link"]')
  const getContainer = () => wrapper.get('[data-testid="group-list-table-name"]')

  beforeEach(() => {
    mockIsTruncated.value = false
  })

  BddTest().when('the component is rendered', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should display the group name', () => {
      expect(getNameLink().text()).toBe(mockGroupOverview.name)
    })

    BddTest().then('it should expose the group id on the container and link', () => {
      expect(getContainer().attributes('data-group-id')).toBe(String(mockGroupOverview.id))
      expect(getNameLink().attributes('data-group-id')).toBe(String(mockGroupOverview.id))
    })

    BddTest().then('it should link to the group detail page', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.ADMIN.GROUP.name,
        params: { id: mockGroupOverview.id }
      })
    })

    BddTest().then('it should pass the group name as tooltip content', () => {
      expect(getAvTooltip().props('content')).toBe(mockGroupOverview.name)
    })

    BddTest().then('it should disable the tooltip when the name is not truncated', () => {
      expect(getAvTooltip().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the group name is truncated', () => {
    beforeEach(async () => {
      mockIsTruncated.value = true
      await mountWith()
    })

    BddTest().then('it should enable the tooltip', () => {
      expect(getAvTooltip().props('disabled')).toBe(false)
    })
  })
})
