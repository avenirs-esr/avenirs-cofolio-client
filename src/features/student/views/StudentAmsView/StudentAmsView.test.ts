import { studentEducationAmsRoute, studentHomeRoute } from '@/features/student/routes'
import StudentAmsView from '@/features/student/views/StudentAmsView/StudentAmsView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a student AMS view', () => {
  let wrapper: VueWrapper
  const stubs = {
    PageTitle: {
      name: 'PageTitle',
      template: '<div />',
      props: ['title', 'breadcrumbLinks']
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(StudentAmsView, {
      global: {
        stubs
      }
    })
  })

  const mockedAmsCode = 'SAE 1.1'
  const mockedAmsName = `${mockedAmsCode} Réaliser l’audit environnemental d’un procédé de synthèse chimique`

  const title = `AMS - ${mockedAmsName}`
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const activitiesBreadcrumbLink = { text: 'Mes AMS', to: studentEducationAmsRoute }
  const currentBreadcrumbLink = { text: `AMS ${mockedAmsCode}` }

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        homeBreadcrumbLink,
        activitiesBreadcrumbLink,
        currentBreadcrumbLink
      ])
    })
  })
})
