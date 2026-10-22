import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import AdminPermissionsView from '@/features/staff/admin/views/AdminPermissionsView/AdminPermissionsView.vue'

const TITLE = 'Permissions'

BddTest().given('an admin permissions view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminPermissionsView>>

  const stubs = {
    PageTitle: PageTitleStub,
  }

  const mountWith = () => {
    wrapper = mount(AdminPermissionsView, {
      global: { stubs }
    })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe(TITLE)
    })
  })
})
