import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import StudentToolsTracesView from './StudentToolsTracesView.vue'

vi.mock('@/common/components/PageTitle', () => ({
  PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] },
}))

describe('studentToolsTracesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  const title = 'Ma bibliothèque de traces'
  const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
  const toolsBreadcrumbLink = { text: 'Mes outils' }
  const currentBreadcrumbLink = { text: 'Mes traces' }

  it('should render PageTitle with correct props', () => {
    const wrapper = mount(StudentToolsTracesView, {
      stubs: { PageTitle: { name: 'PageTitle', template: '<div />', props: ['title', 'breadcrumbLinks'] } },
      plugins: [createPinia()]
    })
    const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

    expect(pageTitle.props('title')).toBe(title)
    expect(pageTitle.props('breadcrumbLinks')).toEqual([
      homeBreadcrumbLink,
      toolsBreadcrumbLink,
      currentBreadcrumbLink
    ])
  })
})
