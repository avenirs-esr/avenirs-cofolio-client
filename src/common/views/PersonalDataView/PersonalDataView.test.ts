import type { RouteLocationNormalized } from 'vue-router'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import PersonalDataView from '@/common/views/PersonalDataView/PersonalDataView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn(),
  }
})

BddTest().given('a personal data view', () => {
  let wrapper: VueWrapper<InstanceType<typeof PersonalDataView>>

  const stubs = { PageTitle: PageTitleStub }

  BddTest().when('the view is mounted in a student route', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mocked(useRoute).mockReturnValue({
        path: '/student/home'
      } as unknown as RouteLocationNormalized)

      wrapper = mount(PersonalDataView, { global: { stubs } })
    })

    const title = 'Données personnelles'
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

  BddTest().when('the view is mounted in a staff route', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.mocked(useRoute).mockReturnValue({
        path: '/staff/home'
      } as unknown as RouteLocationNormalized)

      wrapper = mount(PersonalDataView, { global: { stubs } })
    })

    const title = 'Données personnelles'
    const homeBreadcrumbLink = { text: 'Accueil', to: ROUTES.STAFF.HOME }
    const currentBreadcrumbLink = { text: title }

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        homeBreadcrumbLink,
        currentBreadcrumbLink
      ])
      expect(pageTitle.props('back')).toBe(ROUTES.STAFF.HOME)
    })
  })
})
