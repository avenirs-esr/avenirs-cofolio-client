import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTE_NAMES } from '@/common/constants'
import StudentToolsPagesView from '@/features/student/global/views/StudentToolsPagesView/StudentToolsPagesView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, vi } from 'vitest'

BddTest().given('a student tools pages view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsPagesView>>

  const stubs = { PageTitle: PageTitleStub }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(StudentToolsPagesView, { global: { stubs } })
  })

  const title = '(placeholder) Toutes mes pages libres'
  const homeBreadcrumbLink = { text: 'Accueil', to: ROUTE_NAMES.STUDENT.HOME }
  const currentBreadcrumbLink = { text: 'Mes pages libres' }

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
