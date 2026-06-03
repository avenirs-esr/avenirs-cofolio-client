import type { RoutePageProps } from '@/common/types'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import LegalView from '@/common/views/LegalView/LegalView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a legal view', () => {
  let wrapper: VueWrapper<InstanceType<typeof LegalView>>

  const stubs = { PageTitle: PageTitleStub }

  const mountDefault = (props: RoutePageProps = {}) => {
    wrapper = mount(LegalView, { global: { stubs }, props })
  }

  const title = 'Mentions légales'
  const defaultBreadcrumbLinks = [{ text: title }]

  BddTest().when('the view is mounted without props', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual(defaultBreadcrumbLinks)
    })
  })

  BddTest().when('the view is mounted with breadcrumbs', () => {
    const breadcrumbLinksRaw = [{ textKey: 'global.views.legalView.title' }]

    beforeEach(() => mountDefault({ breadcrumbLinksRaw }))

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toEqual([{ text: title }, ...defaultBreadcrumbLinks])
    })
  })
})
