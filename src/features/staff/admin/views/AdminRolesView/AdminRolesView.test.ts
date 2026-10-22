import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import AdminRolesView from '@/features/staff/admin/views/AdminRolesView/AdminRolesView.vue'

const TITLE = 'Rôles'

BddTest().given('an admin roles view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminRolesView>>

  const stubs = {
    PageTitle: PageTitleStub,
  }

  const mountWith = () => {
    wrapper = mount(AdminRolesView, {
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
