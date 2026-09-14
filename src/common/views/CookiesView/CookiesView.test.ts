import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import CookiesView from '@/common/views/CookiesView/CookiesView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a cookies view', () => {
  let wrapper: VueWrapper<InstanceType<typeof CookiesView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountDefault = () => {
    wrapper = mount(CookiesView, { global: { stubs } })
  }

  const title = 'Gestion des cookies'
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
