import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { DetailPageTitleStub, ToolDetailsContainerStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { ROUTES } from '@/common/constants'
import AdminToolDetailsView from '@/features/staff/admin/views/AdminToolDetailsView/AdminToolDetailsView.vue'

const route = reactive<{ name: string }>({
  name: ROUTES.STAFF.ADMIN.TOOL.NATIONAL.name
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => route
  }
})

BddTest().given('an admin tool details view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminToolDetailsView>>

  const stubs = {
    DetailPageTitle: DetailPageTitleStub,
    ToolDetailsContainer: ToolDetailsContainerStub,
  }

  const mountWith = async (routeName: string = ROUTES.STAFF.ADMIN.TOOL.NATIONAL.name) => {
    route.name = routeName

    wrapper = mountComponent(AdminToolDetailsView, {
      props: { id: 'test-tool-id' },
      global: { stubs },
    })
    await flushPromises()
  }

  const getDetailPageTitle = () => wrapper.findComponent(DetailPageTitleStub)
  const getToolDetailsContainer = () => wrapper.findComponent(ToolDetailsContainerStub)

  BddTest().when('the view is mounted on a national tool route', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the detail page title', () => {
      expect(getDetailPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should render the tool details container with the tool id', () => {
      expect(getToolDetailsContainer().exists()).toBe(true)
      expect(getToolDetailsContainer().props('id')).toBe('test-tool-id')
    })

    BddTest().then('it should pass the isNational flag to the tool details container', () => {
      expect(getToolDetailsContainer().props('isNational')).toBe(true)
    })
  })

  BddTest().when('the view is mounted on a regional tool route', () => {
    beforeEach(async () => {
      await mountWith(ROUTES.STAFF.ADMIN.TOOL.REGIONAL.name)
    })

    BddTest().then('it should not pass the isNational flag to the tool details container', () => {
      expect(getToolDetailsContainer().props('isNational')).toBe(false)
    })
  })

  BddTest().when('the view is mounted on a local tool route', () => {
    beforeEach(async () => {
      await mountWith(ROUTES.STAFF.ADMIN.TOOL.LOCAL.name)
    })

    BddTest().then('it should not pass the isNational flag to the tool details container', () => {
      expect(getToolDetailsContainer().props('isNational')).toBe(false)
    })
  })
})
