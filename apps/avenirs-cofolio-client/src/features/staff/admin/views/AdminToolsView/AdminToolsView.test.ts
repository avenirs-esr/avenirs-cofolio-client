import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { PageTitleStub } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import AdminToolsView from '@/features/staff/admin/views/AdminToolsView/AdminToolsView.vue'

BddTest().given('an institution group detailed view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminToolsView>>

  const stubs = {
    PageTitle: PageTitleStub,
  }

  const mountView = () => {
    wrapper = mount(AdminToolsView, {
      global: { stubs },
    })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('it should render the page title', () => {
      expect(getPageTitle().exists()).toBe(true)
    })
  })
})
