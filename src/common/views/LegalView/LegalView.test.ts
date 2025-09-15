import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import LegalView from '@/common/views/LegalView/LegalView.vue'
import { studentHomeRoute } from '@/features/student/routes'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

BddTest().given('a student deliverables view', () => {
  let wrapper: VueWrapper

  const stubs = { PageTitle: PageTitleStub }

  BddTest().and('we are in a student route', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mocked(useRoute).mockReturnValue({
        path: '/student/home'
      } as any)

      wrapper = mount(LegalView, { global: { stubs } })
    })

    const title = 'Mentions légales'
    const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
    const currentBreadcrumbLink = { text: title }

    BddTest().when('the view is mounted', () => {
      BddTest().then('it should render PageTitle with correct props', () => {
        const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

        expect(pageTitle.props('title')).toBe(title)
        expect(pageTitle.props('breadcrumbLinks')).toEqual([
          homeBreadcrumbLink,
          currentBreadcrumbLink
        ])
      })
    })
  })
})
