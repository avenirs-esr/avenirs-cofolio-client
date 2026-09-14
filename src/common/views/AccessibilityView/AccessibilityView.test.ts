import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import AccessibilityView from '@/common/views/AccessibilityView/AccessibilityView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a accessibility view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AccessibilityView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountDefault = () => {
    wrapper = mount(AccessibilityView, { global: { stubs } })
  }

  const title = 'Déclaration d\'accessibilité'
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
