import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import AdminInstitutionUsersView from '@/features/staff/admin/views/AdminInstitutionUsersView/AdminInstitutionUsersView.vue'
import { InstitutionGroupsMultiselectStub } from '@/features/staff/admin/views/AdminInstitutionUsersView/components/selects/InstitutionGroupsMultiselect/InstitutionGroupsMultiselect.stub'

BddTest().given('an admin institution users view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminInstitutionUsersView>>

  const stubs = {
    PageTitle: PageTitleStub,
    InstitutionGroupsMultiselect: InstitutionGroupsMultiselectStub,
  }

  const mountView = () => {
    wrapper = mount(AdminInstitutionUsersView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getInstitutionGroupsMultiselect = () => wrapper.findComponent(InstitutionGroupsMultiselectStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Utilisateurs de l\'établissement')
    })

    BddTest().then('the institution groups multiselect is rendered', () => {
      expect(getInstitutionGroupsMultiselect().exists()).toBe(true)
    })

    BddTest().and('the user selects institution groups', () => {
      beforeEach(() => {
        getInstitutionGroupsMultiselect().vm.$emit('update:modelValue', ['group1', 'group2'])
      })

      BddTest().then('the model value is updated', () => {
        expect(getInstitutionGroupsMultiselect().props('modelValue')).toEqual(['group1', 'group2'])
      })
    })
  })
})
