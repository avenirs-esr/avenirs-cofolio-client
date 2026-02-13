import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import ProjectActivitiesCatalogView, { type ProjectActivitiesCatalogViewProps } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/ProjectActivitiesCatalogView.vue'
import { ProjectActivitiesCatalogThemes } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a project activities catalog view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivitiesCatalogView>>

  const props: ProjectActivitiesCatalogViewProps = {
    theme: ProjectActivitiesCatalogThemes.NEW,
    id: '0'
  }

  const stubs = {
    PageTitle: PageTitleStub
  }

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(ProjectActivitiesCatalogView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the page title component', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct title', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.props('title')).toBe('Toutes les activités disponibles')
    })

    BddTest().then('it should pass the correct back route', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.props('back')).toBe(ROUTES.STUDENT.HOME)
    })

    BddTest().then('it should pass the correct breadcrumb links', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
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
