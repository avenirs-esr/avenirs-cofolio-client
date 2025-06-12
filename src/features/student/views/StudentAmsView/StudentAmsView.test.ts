import { studentEducationAmsRoute, studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentAmsView from './StudentAmsView.vue'

describe('studentAmsView', () => {
  const stubs = {
    PageTitle: {
      name: 'PageTitle',
      template: '<div />',
      props: ['title', 'breadcrumbLinks']
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockedAmsCode = 'SAE 1.1'
  const mockedAmsName = `${mockedAmsCode} Réaliser l’audit environnemental d’un procédé de synthèse chimique`

  const title = `AMS - ${mockedAmsName}`
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const activitiesBreadcrumbLink = { text: 'Mes AMS', to: studentEducationAmsRoute }
  const currentBreadcrumbLink = { text: `AMS ${mockedAmsCode}` }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentAmsView, {
      global: {
        stubs
      }
    })
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      activitiesBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
