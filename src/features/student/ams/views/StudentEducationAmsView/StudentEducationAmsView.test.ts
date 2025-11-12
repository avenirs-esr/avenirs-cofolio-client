import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTE_NAMES } from '@/common/constants'
import { AmsViewTabsStub } from '@/features/student/ams/views/StudentEducationAmsView/components/AmsViewTabs/AmsViewTabs.stub'
import StudentEducationAmsView from '@/features/student/ams/views/StudentEducationAmsView/StudentEducationAmsView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'

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
  const homeBreadcrumbLink = { text: 'Accueil', to: ROUTE_NAMES.STUDENT.HOME }
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
