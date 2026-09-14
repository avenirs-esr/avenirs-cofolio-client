import type { PageTitleProps } from '@/common/components/PageTitle/PageTitle.vue'
import type { AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { AvBreadcrumbStub, AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const breadcrumbLinks = ref<AvBreadcrumbProps['links']>([])

vi.mock('@/common/composables', () => ({
  useBreadcrumb: (trailingLinks: () => AvBreadcrumbProps['links']) => ({
    breadcrumbLinks: computed(() => [
      ...breadcrumbLinks.value,
      ...trailingLinks()
    ])
  })
}))

BddTest().given('a page title', () => {
  let wrapper: VueWrapper<InstanceType<typeof PageTitle>>

  const trailingLinks = [
    { text: 'Home', to: '/' },
    { text: 'Page name' }
  ]
  const title = 'Page title'
  const props: PageTitleProps = {
    trailingLinks,
    title
  }

  const stubs = { AvBreadcrumb: AvBreadcrumbStub, AvButton: AvButtonStub }

  beforeEach(async () => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with provided props', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter<typeof PageTitle>(PageTitle, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render properly', () => {
      const breadcrumb = wrapper.getComponent(AvBreadcrumbStub)
      expect(breadcrumb.props('links')).toStrictEqual(trailingLinks)

      const pageTitle = wrapper.find('.page-title')
      const titleElement = pageTitle.find('h1')
      expect(titleElement.text()).toBe(title)
    })
  })

  BddTest().when('the component is mounted and useBreadcrumb returns breadcrumb links', () => {
    beforeEach(async () => {
      breadcrumbLinks.value = [{ text: 'First', to: '/' }, { text: 'Second' }]
      wrapper = await mountWithRouter<typeof PageTitle>(PageTitle, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the breadcrumb with the links from useBreadcrumb', () => {
      const breadcrumb = wrapper.getComponent(AvBreadcrumbStub)
      expect(breadcrumb.props('links')).toStrictEqual([...breadcrumbLinks.value, ...trailingLinks])
    })
  })

  BddTest().when('the component is mounted with the title slot', () => {
    const slotTitle = 'Slot Page Title'

    beforeEach(async () => {
      wrapper = await mountWithRouter<typeof PageTitle>(PageTitle, {
        props,
        slots: {
          title: `<h1 class="slot-title">${slotTitle}</h1>`
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the slot title instead of the prop title', () => {
      const pageTitle = wrapper.find('.page-title')
      const slotTitleElement = pageTitle.find('.slot-title')
      expect(slotTitleElement.text()).toBe(slotTitle)
    })
  })
})
