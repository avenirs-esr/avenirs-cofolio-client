import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import AdminProgramsView from '@/features/staff/admin/views/AdminProgramsView/AdminProgramsView.vue'

const TITLE = 'Formations'

BddTest().given('an admin programs view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminProgramsView>>

  const stubs = {
    PageTitle: PageTitleStub,
  }

  const mountWith = () => {
    wrapper = mount(AdminProgramsView, {
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
