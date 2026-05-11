import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import EditNationalActivityView from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { vi } from 'vitest'

const mockMode = ref('edit')

vi.mock('@vueuse/router', () => ({
  useRouteQuery: vi.fn((key: string, defaultValue: string) => {
    if (key === 'mode') {
      return mockMode
    }
    return ref(defaultValue)
  })
}))

BddTest().given('a national activity view', () => {
  const stubs = { PageTitle: PageTitleStub }
  let wrapper: VueWrapper<InstanceType<typeof EditNationalActivityView>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the view is mounted in add mode', () => {
    beforeEach(() => {
      mockMode.value = 'add'
      wrapper = mount(EditNationalActivityView, { global: { stubs } })
    })

    BddTest().then('it should render PageTitle with add props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe('Créer mon activité')
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités', to: ROUTES.STAFF.ACTIVITIES },
        { text: 'Créer mon activité' }
      ])
      expect(pageTitle.props('back')).toBe(ROUTES.STAFF.ACTIVITIES)
    })
  })

  BddTest().when('the view is mounted in edit mode', () => {
    beforeEach(() => {
      mockMode.value = 'edit'
      wrapper = mount(EditNationalActivityView, { global: { stubs } })
    })

    BddTest().then('it should render PageTitle with edit props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe('Modifier l\'activité')
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités', to: ROUTES.STAFF.ACTIVITIES },
        { text: 'Modifier l\'activité' }
      ])
      expect(pageTitle.props('back')).toBe(ROUTES.STAFF.ACTIVITIES)
    })
  })
})
