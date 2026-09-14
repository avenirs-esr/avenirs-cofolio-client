import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import PersonalDataView from '@/common/views/PersonalDataView/PersonalDataView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a personal data view', () => {
  let wrapper: VueWrapper<InstanceType<typeof PersonalDataView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountDefault = () => {
    wrapper = mount(PersonalDataView, { global: { stubs } })
  }

  const title = 'Données personnelles'
  const defaultTrailingLinks = [{ text: title }]

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountDefault()
    })

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('trailingLinks')).toEqual(defaultTrailingLinks)
    })
  })
})
