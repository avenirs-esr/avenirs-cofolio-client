import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { DetailPageTitleStub, ManageToolDropdownStub, ToolDetailsContainerStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, expect, vi } from 'vitest'
import { ROUTES } from '@/constants'
import NationalToolDetailsView from '@/features/national-tools/views/NationalToolDetailsView/NationalToolDetailsView.vue'

const { replaceMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}))

BddTest().given('a national tool details view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalToolDetailsView>>

  const stubs = {
    DetailPageTitle: DetailPageTitleStub,
    ManageToolDropdown: ManageToolDropdownStub,
    ToolDetailsContainer: ToolDetailsContainerStub,
  }

  const getPageTitle = () => wrapper.findComponent(DetailPageTitleStub)
  const getManageToolDropdown = () => wrapper.findComponent(ManageToolDropdownStub)
  const getToolDetailsContainer = () => wrapper.findComponent(ToolDetailsContainerStub)

  const mountWith = async (id: string) => {
    wrapper = mountComponent(NationalToolDetailsView, {
      props: { id },
      global: { stubs },
    })

    await vi.waitFor(() => {
      expect(getPageTitle().props('title')).toBe('Outil national 0')
    })
  }

  afterEach(() => {
    wrapper?.unmount()
    vi.clearAllMocks()
  })

  BddTest().when('the national tool has loaded', () => {
    beforeEach(async () => {
      await mountWith('NATIONAL_ID')
    })

    BddTest().then('it should render the tool name as the page title and trailing breadcrumb', () => {
      expect(getPageTitle().props('title')).toBe('Outil national 0')
      expect(getPageTitle().props('trailingLinks')).toStrictEqual([
        { text: 'Outil national 0' },
      ])
    })

    BddTest().then('it should render the manage tool dropdown with the loaded tool', () => {
      expect(getManageToolDropdown().exists()).toBe(true)
      expect(getManageToolDropdown().props('tool')).toMatchObject({
        name: 'Outil national 0',
      })
      expect(getManageToolDropdown().props('isLoading')).toBe(false)
    })

    BddTest().then('it should render the national tool details container with the route identifier', () => {
      expect(getToolDetailsContainer().props('id')).toBe('NATIONAL_ID')
      expect(getToolDetailsContainer().props('isNational')).toBe(true)
    })

    BddTest().when('the national tool is deleted', () => {
      BddTest().then('it should redirect to the national tools list', async () => {
        getManageToolDropdown().vm.$emit('deleted')

        expect(replaceMock).toHaveBeenCalledExactlyOnceWith(ROUTES.NATIONAL_TOOLS)
      })
    })
  })
})
