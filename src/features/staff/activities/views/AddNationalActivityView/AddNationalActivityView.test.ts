import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import AddNationalActivityView from '@/features/staff/activities/views/AddNationalActivityView/AddNationalActivityView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a student mailbox view', () => {
  const stubs = { PageTitle: PageTitleStub }
  let wrapper: VueWrapper<InstanceType<typeof AddNationalActivityView>>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(AddNationalActivityView, { global: { stubs } })
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe('Créer mon activité')
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités', to: ROUTES.STAFF.ACTIVITIES },
        { text: 'Créer mon activité' }
      ])
    })
  })
})
