import { getProfileErrorHandler } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { server } from '@/__mocks__/msw/server'
import { ProfileCardStub } from '@/features/user/components/cards/ProfileCard/ProfileCard.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ROUTES } from '@/common/constants/route-names'
import { KitContentTabsStub } from '@/features/kit/views/StudentToolsKitView/components/KitContentTabs/KitContentTabs.stub'
import StudentToolsKitView from '@/features/kit/views/StudentToolsKitView/StudentToolsKitView.vue'
import { AvBreadcrumbStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a student tools kit view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsKitView>>

  const stubs = {
    AvBreadcrumb: AvBreadcrumbStub,
    ProfileCard: ProfileCardStub,
    QuerySuspense: QuerySuspenseStub,
    KitContentTabs: KitContentTabsStub,
  }

  BddTest().when('the view is mounted with a server error', async () => {
    beforeEach(async () => {
      server.use(getProfileErrorHandler)
      wrapper = mountComponent(StudentToolsKitView, { global: { stubs } })
      await flushPromises()
    })

    BddTest().then('it should display the breadcrumbs', () => {
      const breadcrumb = wrapper.findComponent(AvBreadcrumbStub)
      expect(breadcrumb.exists()).toBe(true)
      expect(breadcrumb.props('links')).toEqual([
        { text: 'Accueil', to: ROUTES.STUDENT.HOME },
        { text: 'Mes outils' },
        { text: 'Mon kit prêt à l\'emploi' },
      ])
    })

    BddTest().then('it should display the title, subtitle and consign', () => {
      expect(wrapper.find('[data-testid="kit-title"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="kit-subtitle"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="kit-consign"]').exists()).toBe(true)
    })

    BddTest().then('it should display the error message', () => {
      expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)
    })

    BddTest().then('it should not display the profile card', () => {
      expect(wrapper.findComponent(ProfileCardStub).exists()).toBe(false)
    })

    BddTest().then('it should display the kit content tabs', () => {
      expect(wrapper.findComponent(KitContentTabsStub).exists()).toBe(true)
    })
  })

  BddTest().when('the view is mounted with a successful response', async () => {
    beforeEach(async () => {
      wrapper = mountComponent(StudentToolsKitView, { global: { stubs } })
      await flushPromises()
    })

    BddTest().then('it should display the breadcrumbs', () => {
      const breadcrumb = wrapper.findComponent(AvBreadcrumbStub)
      expect(breadcrumb.exists()).toBe(true)
      expect(breadcrumb.props('links')).toEqual([
        { text: 'Accueil', to: ROUTES.STUDENT.HOME },
        { text: 'Mes outils' },
        { text: 'Mon kit prêt à l\'emploi' },
      ])
    })

    BddTest().then('it should display the title, subtitle and consign', () => {
      expect(wrapper.find('[data-testid="kit-title"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="kit-subtitle"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="kit-consign"]').exists()).toBe(true)
    })

    BddTest().then('it should display the profile card', () => {
      expect(wrapper.findComponent(ProfileCardStub).exists()).toBe(true)
    })

    BddTest().then('it should not display the error message', () => {
      expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(false)
    })

    BddTest().then('it should display the kit content tabs', () => {
      expect(wrapper.findComponent(KitContentTabsStub).exists()).toBe(true)
    })
  })
})
