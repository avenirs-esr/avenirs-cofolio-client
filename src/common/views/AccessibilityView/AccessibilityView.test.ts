import type { RoutePageProps } from '@/common/types'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import AccessibilityView from '@/common/views/AccessibilityView/AccessibilityView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a accessibility view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AccessibilityView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountDefault = (props: RoutePageProps = {}) => {
    wrapper = mount(AccessibilityView, { global: { stubs }, props })
  }

  const title = 'Déclaration d\'accessibilité'
  const defaultBreadcrumbLinks = [{ text: title }]

  BddTest().when('the view is mounted without props', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual(defaultBreadcrumbLinks)
      expect(pageTitle.props('back')).toBe(undefined)
    })
  })

  BddTest().when('the view is mounted with back route', () => {
    const backRoute = '/back-route'

    beforeEach(() => mountDefault({ backRoute }))

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual(defaultBreadcrumbLinks)
      expect(pageTitle.props('back')).toBe('/back-route')
    })
  })

  BddTest().when('the view is mounted with breadcrumbs', () => {
    const breadcrumbLinksRaw = [{ textKey: 'global.views.accessibilityView.title' }]

    beforeEach(() => mountDefault({ breadcrumbLinksRaw }))

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([{ text: title }, ...defaultBreadcrumbLinks])
      expect(pageTitle.props('back')).toBe(undefined)
    })
  })
})
