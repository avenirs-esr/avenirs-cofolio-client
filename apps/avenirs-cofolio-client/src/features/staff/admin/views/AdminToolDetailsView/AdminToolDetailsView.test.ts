import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { DetailPageTitleStub, ManageToolDropdownStub, ToolDetailsContainerStub } from '@avenirs-esr/shared'
import { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { ROUTES } from '@/common/constants'
import AdminToolDetailsView from '@/features/staff/admin/views/AdminToolDetailsView/AdminToolDetailsView.vue'

const { navigateToStaffAdminToolsMock } = vi.hoisted(() => ({
  navigateToStaffAdminToolsMock: vi.fn(),
}))

const route = reactive<{ name: string }>({
  name: ROUTES.STAFF.ADMIN.TOOL.NATIONAL.name,
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => route,
  }
})

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()

  return {
    ...actual,
    useNavigation: () => ({
      navigateToStaffAdminTools: navigateToStaffAdminToolsMock,
    }),
  }
})

BddTest().given('an admin tool details view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminToolDetailsView>>

  const stubs = {
    DetailPageTitle: DetailPageTitleStub,
    ManageToolDropdown: ManageToolDropdownStub,
    ToolDetailsContainer: ToolDetailsContainerStub,
  }

  const getDetailPageTitle = () => wrapper.findComponent(DetailPageTitleStub)
  const getManageToolDropdown = () => wrapper.findComponent(ManageToolDropdownStub)
  const getToolDetailsContainer = () => wrapper.findComponent(ToolDetailsContainerStub)

  const mountWith = async (routeName: string = ROUTES.STAFF.ADMIN.TOOL.NATIONAL.name) => {
    route.name = routeName

    wrapper = mountComponent(AdminToolDetailsView, {
      props: { id: 'test-tool-id' },
      global: { stubs },
    })

    await flushPromises()

    await vi.waitFor(() => {
      const dropdown = getManageToolDropdown()
      expect(dropdown.exists()).toBe(true)
    })
  }

  beforeEach(() => {
    navigateToStaffAdminToolsMock.mockClear()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('the view is mounted on a national tool route', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the detail page title', () => {
      expect(getDetailPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should render the national tool details container with the tool id', () => {
      expect(getToolDetailsContainer().exists()).toBe(true)
      expect(getToolDetailsContainer().props('id')).toBe('test-tool-id')
      expect(getToolDetailsContainer().props('isNational')).toBe(true)
    })

    BddTest().then('it should render the manage tool dropdown with the national tool', () => {
      expect(getManageToolDropdown().exists()).toBe(true)
      expect(getManageToolDropdown().props('tool')).toMatchObject({
        type: EToolType.NATIONAL,
      })
    })

    BddTest().then('it should disable the manage tool dropdown', () => {
      expect(getManageToolDropdown().props('disabled')).toBe(true)
    })

    BddTest().then('it should provide a tooltip explaining why national tools cannot be managed', () => {
      expect(getManageToolDropdown().props('disabledTooltip')).toBeTruthy()
    })

    BddTest().then('it should pass the loading state to the manage tool dropdown', () => {
      expect(getManageToolDropdown().props('isLoading')).toBe(false)
    })
  })

  BddTest().when('the view is mounted on a regional tool route', () => {
    beforeEach(async () => {
      await mountWith(ROUTES.STAFF.ADMIN.TOOL.REGIONAL.name)
    })

    BddTest().then('it should not pass the isNational flag to the tool details container', () => {
      expect(getToolDetailsContainer().props('isNational')).toBe(false)
    })

    BddTest().then('it should enable the manage tool dropdown', () => {
      expect(getManageToolDropdown().props('disabled')).toBe(false)
    })

    BddTest().then('it should render the manage tool dropdown with the local tool', () => {
      expect(getManageToolDropdown().exists()).toBe(true)
      expect(getManageToolDropdown().props('tool')).toBeDefined()
    })
  })

  BddTest().when('the view is mounted on a local tool route', () => {
    beforeEach(async () => {
      await mountWith(ROUTES.STAFF.ADMIN.TOOL.LOCAL.name)
    })

    BddTest().then('it should not pass the isNational flag to the tool details container', () => {
      expect(getToolDetailsContainer().props('isNational')).toBe(false)
    })

    BddTest().then('it should enable the manage tool dropdown', () => {
      expect(getManageToolDropdown().props('disabled')).toBe(false)
    })
  })

  BddTest().when('the tool is deleted', () => {
    beforeEach(async () => {
      await mountWith(ROUTES.STAFF.ADMIN.TOOL.LOCAL.name)
    })

    BddTest().then('it should navigate to staff admin tools with preview mode enabled', () => {
      getManageToolDropdown().vm.$emit('deleted')

      expect(navigateToStaffAdminToolsMock).toHaveBeenCalledExactlyOnceWith(true)
    })
  })
})
