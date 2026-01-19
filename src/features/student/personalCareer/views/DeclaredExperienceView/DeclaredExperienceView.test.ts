import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { DeclaredExperienceSideMenuStub }
  from '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.stub'
import DeclaredExperienceView
  from '@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  PageTitle: PageTitleStub,
  DeclaredExperienceSideMenu: DeclaredExperienceSideMenuStub
}

BddTest().given('a declared experience view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceView>>

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(DeclaredExperienceView, {
      global: { stubs }
    })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
      vi.clearAllMocks()
    })

    BddTest().then('it should render PageTitle with correct title and breadcrumbs', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.exists()).toBe(true)

      expect(pageTitle.props('title')).toBe('Détail de mon expérience déclarée')

      const breadcrumbs = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbs).toHaveLength(4)
    })

    BddTest().then('it should render the side menu', () => {
      const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })
      expect(sideMenu.exists()).toBe(true)
    })

    BddTest().then('it should pass a dropdown into the title', () => {
      const dropdown = wrapper.findComponent({ name: 'DeclaredExperienceDetailsDropdown' })
      expect(dropdown.exists()).toBe(true)
    })
  })
})
