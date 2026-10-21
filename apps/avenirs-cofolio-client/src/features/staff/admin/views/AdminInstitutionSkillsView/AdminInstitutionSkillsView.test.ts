import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import AdminInstitutionSkillsView from '@/features/staff/admin/views/AdminInstitutionSkillsView/AdminInstitutionSkillsView.vue'

BddTest().given('an admin institution skills view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminInstitutionSkillsView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountView = () => {
    wrapper = mount(AdminInstitutionSkillsView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountView()
    })

    BddTest().then('the page title is rendered', () => {
      expect(getPageTitle().exists()).toBe(true)
      expect(getPageTitle().props('title')).toBe('Référentiels de compétences de l\'établissement')
    })
  })
})
