import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import AdminInstitutionGroupsView from '@/features/staff/admin/views/AdminInstitutionGroupsView/AdminInstitutionGroupsView.vue'
import { GroupsListStub } from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsList/GroupsList.stub'

BddTest().given('an admin institution groups view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminInstitutionGroupsView>>

  const stubs = {
    PageTitle: PageTitleStub,
    GroupsList: GroupsListStub,
  }

  const mountView = () => {
    wrapper = mount(AdminInstitutionGroupsView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getGroupsList = () => wrapper.findComponent(GroupsListStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Groupes de l\'établissement')
    })

    BddTest().then('the groups list is rendered', () => {
      expect(getGroupsList().exists()).toBe(true)
    })

    // TODO: US#3028
    BddTest().then('the groups list receives the expected groups', () => {
      expect(getGroupsList().props('groups')).toHaveLength(3)
    })
  })
})
