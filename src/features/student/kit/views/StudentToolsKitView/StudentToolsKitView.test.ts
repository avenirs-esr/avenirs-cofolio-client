import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { ProfileCardStub } from '@/common/components/cards/ProfileCard/ProfileCard.stub'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import { ExportKitButtonStub } from '@/features/student/kit/views/StudentToolsKitView/components/interaction/ExportKitButton/ExportKitButton.stub'
import { KitContentTabsStub } from '@/features/student/kit/views/StudentToolsKitView/components/KitContentTabs/KitContentTabs.stub'
import StudentToolsKitView from '@/features/student/kit/views/StudentToolsKitView/StudentToolsKitView.vue'

const mockProfile = ref(mockedProfileOverview)
const mockIsProfileLoading = ref(false)

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    profile: mockProfile,
    isProfileLoading: mockIsProfileLoading
  })
}))

BddTest().given('a student tools kit view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsKitView>>

  const stubs = {
    PageTitle: PageTitleStub,
    ProfileCard: ProfileCardStub,
    QuerySuspense: QuerySuspenseStub,
    KitContentTabs: KitContentTabsStub,
    ExportKitButton: ExportKitButtonStub,
  }

  const mountWith = ({ isProfileLoading = false }: { isProfileLoading?: boolean } = {}) => {
    mockIsProfileLoading.value = isProfileLoading

    wrapper = mountComponent(StudentToolsKitView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getProfileCard = () => wrapper.findComponent(ProfileCardStub)
  const getKitContentTabs = () => wrapper.findComponent(KitContentTabsStub)
  const getExportKitButton = () => wrapper.findComponent(ExportKitButtonStub)
  const getQuerySuspenseLoader = () => wrapper.find('[data-testid="query-suspense-loading"]')

  BddTest().when('the view is mounted while the profile is still loading', () => {
    beforeEach(() => {
      mountWith({ isProfileLoading: true })
    })

    BddTest().then('it should display the page title', () => {
      expect(getPageTitle().exists()).toBe(true)
    })

    BddTest().then('it should display the export kit button', () => {
      expect(getExportKitButton().exists()).toBe(true)
    })

    BddTest().then('it should display the loader', () => {
      expect(getQuerySuspenseLoader().exists()).toBe(true)
    })

    BddTest().then('it should not display the profile card', () => {
      expect(getProfileCard().exists()).toBe(false)
    })

    BddTest().then('it should display the kit content tabs', () => {
      expect(getKitContentTabs().exists()).toBe(true)
    })
  })

  BddTest().when('the view is mounted with the profile loaded', () => {
    beforeEach(() => {
      mountWith()
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

    BddTest().then('it should not display the loader', () => {
      expect(getQuerySuspenseLoader().exists()).toBe(false)
    })

    BddTest().then('it should display the kit content tabs', () => {
      expect(getKitContentTabs().exists()).toBe(true)
    })
  })
})
