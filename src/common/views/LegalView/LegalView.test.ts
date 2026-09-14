import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import LegalView from '@/common/views/LegalView/LegalView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a legal view', () => {
  let wrapper: VueWrapper<InstanceType<typeof LegalView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountDefault = () => {
    wrapper = mount(LegalView, { global: { stubs } })
  }

  const title = 'Mentions légales'
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
