import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import UpdatePageTitle from '@/common/components/UpdatePageTitle/UpdatePageTitle.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an update page title', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdatePageTitle>>

  const breadcrumbLinks = [
    { text: 'Home', to: '/' },
    { text: 'Update' }
  ]
  const title = 'My page title'
  const props = {
    title,
    breadcrumbLinks
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter<typeof UpdatePageTitle>(UpdatePageTitle, {
        props,
        global: {
          stubs: {
            PageTitle: PageTitleStub
          }
        }
      })
    })

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.getComponent(PageTitleStub)

      expect(pageTitle.props('title')).toBe(title)
      expect(pageTitle.props('breadcrumbLinks')).toStrictEqual(breadcrumbLinks)
    })

    BddTest().then('it should render the detailed title slot', () => {
      const titleContainer = wrapper.find('h1')
      expect(titleContainer.exists()).toBe(true)
      expect(titleContainer.text()).toContain('Modifier')
      expect(titleContainer.text()).toContain(title)
    })

    BddTest().then('the page title should be highlighted', () => {
      const highlightedTitle = wrapper.find('.n4')
      expect(highlightedTitle.exists()).toBe(true)
      expect(highlightedTitle.text()).toBe(title)
    })
  })
})
