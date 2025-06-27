import { studentHomeRoute } from '@/features/student/routes'
import StudentEducationAmsView from '@/features/student/views/StudentEducationAmsView/StudentEducationAmsView.vue'
import { mountWithRouter } from 'tests/utils'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentEducationAmsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  const title = 'Mes Activités de Mise en situation (AMS)'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const currentBreadcrumbLink = { text: 'Mes AMS' }

  it('should render PageTitle with correct props', async () => {
    const wrapper = await mountWithRouter(StudentEducationAmsView, {
      plugins: [createPinia()],
      global: {
        stubs: {
          AmsViewTabs: {
            name: 'AmsViewTabs',
            template: '<div />',
            props: ['amsData']
          }
        }
      }
    })
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
