import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import AccessibilityView from '@/common/views/AccessibilityView/AccessibilityView.vue'

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
