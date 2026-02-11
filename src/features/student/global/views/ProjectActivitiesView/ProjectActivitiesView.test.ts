import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import ProjectActivitiesView from '@/features/student/global/views/ProjectActivitiesView/ProjectActivitiesView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a project activities view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivitiesView>>

  const stubs = {
    PageTitle: PageTitleStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(ProjectActivitiesView, {
      global: { stubs }
    })
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render the page title component', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct title', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.props('title')).toBe('Mes activités')
    })

    BddTest().then('it should pass the correct back route', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.props('back')).toBe(ROUTES.STUDENT.HOME)
    })

    BddTest().then('it should pass the correct breadcrumb links', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      const breadcrumbLinks = pageTitle.props('breadcrumbLinks')

      expect(breadcrumbLinks).toHaveLength(3)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: ROUTES.STUDENT.HOME
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Mes activités'
      })
    })
  })
})
