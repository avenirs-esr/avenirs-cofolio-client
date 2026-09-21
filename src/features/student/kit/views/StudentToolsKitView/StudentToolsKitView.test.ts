import type { BreadcrumbLinkRaw } from '@/common/types'
import { getProfileErrorHandler } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ProfileCardStub } from '@/common/components/ProfileCard/ProfileCard.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { ROUTES } from '@/common/constants/route-names'
import { ExportKitButtonStub } from '@/features/student/kit/views/StudentToolsKitView/components/interaction/ExportKitButton/ExportKitButton.stub'
import { KitContentTabsStub } from '@/features/student/kit/views/StudentToolsKitView/components/KitContentTabs/KitContentTabs.stub'
import StudentToolsKitView from '@/features/student/kit/views/StudentToolsKitView/StudentToolsKitView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const route = reactive<{ name: string, meta: { breadcrumb: BreadcrumbLinkRaw[] } }>({
  name: ROUTES.STUDENT.TOOLS_KIT.name,
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STUDENT.HOME,
      META_BREADCRUMBS.STUDENT.TOOLS.DEFAULT,
      META_BREADCRUMBS.STUDENT.TOOLS.KIT,
    ],
  }
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => route,
  }
})

BddTest().given('a student tools kit view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsKitView>>

  const stubs = {
    PageTitle: PageTitleStub,
    ProfileCard: ProfileCardStub,
    QuerySuspense: QuerySuspenseStub,
    KitContentTabs: KitContentTabsStub,
    ExportKitButton: ExportKitButtonStub,
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getProfileCard = () => wrapper.findComponent(ProfileCardStub)
  const getKitContentTabs = () => wrapper.findComponent(KitContentTabsStub)
  const getExportKitButton = () => wrapper.findComponent(ExportKitButtonStub)
  const getQuerySuspenseError = () => wrapper.find('[data-testid="query-suspense-error"]')

  BddTest().when('the view is mounted with a server error', async () => {
    beforeEach(async () => {
      server.use(getProfileErrorHandler)
      wrapper = mountComponent(StudentToolsKitView, { global: { stubs } })
      await flushPromises()
    })

    BddTest().then('it should display the page title', () => {
      expect(getPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should display the export kit button', () => {
      expect(getExportKitButton().exists()).toBe(true)
    })

    BddTest().then('it should display the error message', () => {
      expect(getQuerySuspenseError().exists()).toBe(true)
    })

    BddTest().then('it should not display the profile card', () => {
      expect(getProfileCard().exists()).toBe(false)
    })

    BddTest().then('it should display the kit content tabs', () => {
      expect(getKitContentTabs().exists()).toBe(true)
    })
  })

  BddTest().when('the view is mounted with a successful response', async () => {
    beforeEach(async () => {
      wrapper = mountComponent(StudentToolsKitView, { global: { stubs } })
      await flushPromises()
    })

    BddTest().then('it should display the export kit button', () => {
      expect(getExportKitButton().exists()).toBe(true)
    })

    BddTest().then('it should display the page title', () => {
      expect(getPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should display the profile card', () => {
      expect(getProfileCard().exists()).toBe(true)
    })

    BddTest().then('it should not display the error message', () => {
      expect(getQuerySuspenseError().exists()).toBe(false)
    })

    BddTest().then('it should display the kit content tabs', () => {
      expect(getKitContentTabs().exists()).toBe(true)
    })
  })
})
