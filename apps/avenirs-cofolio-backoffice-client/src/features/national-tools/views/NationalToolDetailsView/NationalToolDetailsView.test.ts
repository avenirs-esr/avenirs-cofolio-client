import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { DetailPageTitleStub, ToolDetailsContainerStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, expect, vi } from 'vitest'
import NationalToolDetailsView from '@/features/national-tools/views/NationalToolDetailsView/NationalToolDetailsView.vue'

BddTest().given('a national tool details view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalToolDetailsView>>

  const stubs = {
    DetailPageTitle: DetailPageTitleStub,
    ToolDetailsContainer: ToolDetailsContainerStub,
  }

  const getPageTitle = () => wrapper.findComponent(DetailPageTitleStub)
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
  })

  BddTest().when('the national tool has loaded', () => {
    beforeEach(async () => {
      await mountWith('NATIONAL_ID')
    })

    BddTest().then('it should render the tool name as the page title and trailing breadcrumb', () => {
      expect(getPageTitle().props('title')).toBe('Outil national 0')
      expect(getPageTitle().props('trailingLinks')).toStrictEqual([{ text: 'Outil national 0' }])
    })

    BddTest().then('it should render the national tool details container with the route identifier', () => {
      expect(getToolDetailsContainer().props('id')).toBe('NATIONAL_ID')
      expect(getToolDetailsContainer().props('isNational')).toBe(true)
    })
  })
})
