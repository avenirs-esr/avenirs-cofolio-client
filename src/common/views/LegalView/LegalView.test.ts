import type { RouteLocationNormalized } from 'vue-router'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import LegalView from '@/common/views/LegalView/LegalView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

BddTest().given('a legal view', () => {
  let wrapper: VueWrapper<InstanceType<typeof LegalView>>

  const stubs = { PageTitle: PageTitleStub }

  BddTest().when('the view is mounted in a student route', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mocked(useRoute).mockReturnValue({
        path: '/student/home'
      } as unknown as RouteLocationNormalized)

      wrapper = mount(LegalView, { global: { stubs } })
    })

    const title = 'Mentions légales'
    const homeBreadcrumbLink = { text: 'Accueil', to: ROUTES.STUDENT.HOME }
    const currentBreadcrumbLink = { text: title }

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        homeBreadcrumbLink,
        currentBreadcrumbLink
      ])
      expect(pageTitle.props('back')).toBe(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('the view is mounted in a teacher route', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mocked(useRoute).mockReturnValue({
        path: '/teacher/home'
      } as unknown as RouteLocationNormalized)

      wrapper = mount(LegalView, { global: { stubs } })
    })

    const title = 'Mentions légales'
    const homeBreadcrumbLink = { text: 'Accueil', to: ROUTES.TEACHER.HOME }
    const currentBreadcrumbLink = { text: title }

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        homeBreadcrumbLink,
        currentBreadcrumbLink
      ])
      expect(pageTitle.props('back')).toBe(ROUTES.TEACHER.HOME)
    })
  })
})
