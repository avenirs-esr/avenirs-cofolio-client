import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { studentHomeRoute } from '@/features/student/routes'
import { AmsViewTabsStub } from '@/features/student/views/StudentEducationAmsView/components/AmsViewTabs/AmsViewTabs.stub'
import StudentEducationAmsView from '@/features/student/views/StudentEducationAmsView/StudentEducationAmsView.vue'
import { mountWithRouter } from '@/ui/tests/utils'
import { BddTest } from 'tests/utils'

BddTest().given('a student education AMS view', () => {
  let wrapper: VueWrapper

  const stubs = {
    AmsViewTabs: AmsViewTabsStub,
    PageTitle: PageTitleStub,
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    wrapper = await mountWithRouter(StudentEducationAmsView, {
      plugins: [createPinia()],
      global: { stubs }
    })
  })

  const title = 'Mes Activités de Mise en situation (AMS)'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Mes AMS' }

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', async () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        homeBreadcrumbLink,
        currentBreadcrumbLink
      ])
    })
  })
})
