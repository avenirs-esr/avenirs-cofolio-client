import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import CguView from '@/common/views/CguView/CguView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a cgu view', () => {
  let wrapper: VueWrapper<InstanceType<typeof CguView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountDefault = () => {
    wrapper = mount(CguView, { global: { stubs } })
  }

  const title = 'Conditions générales d\'utilisation'
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
