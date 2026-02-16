import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { EActivityThematic } from '@/api/avenir-esr'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { ActivityPreviewStub } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.stub'
import ProjectActivitiesCatalogView, { type ProjectActivitiesCatalogViewProps } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/ProjectActivitiesCatalogView.vue'

BddTest().given('a project activities catalog view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivitiesCatalogView>>

  const stubs = {
    PageTitle: PageTitleStub,
    ActivityPreview: ActivityPreviewStub,
    Loader: LoaderStub
  }

  BddTest().when('the view is mounted with a valid activity', () => {
    const props: ProjectActivitiesCatalogViewProps = {
      theme: EActivityThematic.SELF_KNOWLEDGE,
      id: '0'
    }

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

    BddTest().then('it should render the activity preview component', async () => {
      await vi.waitFor(() => expect(wrapper.findComponent(ActivityPreviewStub).exists()).toBe(true))
    })
  })

  BddTest().when('the view is mounted with an invalid activity', () => {
    const props: ProjectActivitiesCatalogViewProps = {
      theme: EActivityThematic.SELF_KNOWLEDGE,
      id: 'INVALID_ACTIVITY_ID'
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(ProjectActivitiesCatalogView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should not render the activity preview component', () => {
      const activityPreview = wrapper.findComponent(ActivityPreviewStub)
      expect(activityPreview.exists()).toBe(false)
    })
  })
})
