import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import AdminInstitutionGroupsView from '@/features/staff/admin/views/AdminInstitutionGroupsView/AdminInstitutionGroupsView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an admin institution groups view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminInstitutionGroupsView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountView = () => {
    wrapper = mount(AdminInstitutionGroupsView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Groupes de l\'établissement')
    })
  })
})
