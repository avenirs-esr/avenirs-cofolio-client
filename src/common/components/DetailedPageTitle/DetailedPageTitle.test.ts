import type { VueWrapper } from '@vue/test-utils'
import DetailedPageTitle from '@/common/components/DetailedPageTitle/DetailedPageTitle.vue'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return { ...actual, useTextTruncation: () => ({ isTruncated: mockIsTruncated }) }
})

BddTest().given('a detailed page title', () => {
  let wrapper: VueWrapper<InstanceType<typeof DetailedPageTitle>>

  const stubs = {
    PageTitle: PageTitleStub,
    AvTooltip: AvTooltipStub
  }

  const breadcrumbLinks = [
    { text: 'Home', to: '/' },
    { text: 'Details' }
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
      wrapper = await mountWithRouter<typeof DetailedPageTitle>(DetailedPageTitle, {
        props,
        global: { stubs }
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
      expect(titleContainer.text()).toContain('Détail')
      expect(titleContainer.text()).toContain(title)
    })

    BddTest().then('the page title should be highlighted', () => {
      const highlightedTitle = wrapper.find('.n4')
      expect(highlightedTitle.exists()).toBe(true)
      expect(highlightedTitle.text()).toBe(title)
    })
  })
})
