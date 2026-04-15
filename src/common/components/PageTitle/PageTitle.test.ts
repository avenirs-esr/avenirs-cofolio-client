import type { VueWrapper } from '@vue/test-utils'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { AvBreadcrumbStub, AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { beforeEach, expect, type MockedFunction, vi } from 'vitest'
import { type Router, useRouter } from 'vue-router'

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}))

const mockedUseRouter: MockedFunction<typeof useRouter> = vi.mocked(useRouter)

BddTest().given('a page title', () => {
  let wrapper: VueWrapper

  const breadcrumbLinks = [
    { text: 'Home', to: '/' },
    { text: 'Page name' }
  ]
  const title = 'Page title'
  const back = ROUTES.STUDENT.PROJECT_SKILLS
  const props = {
    breadcrumbLinks,
    title
  }

  const stubs = { AvBreadcrumb: AvBreadcrumbStub, AvButton: AvButtonStub }

  beforeEach(async () => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with provided props', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(PageTitle, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render properly', () => {
      const breadcrumb = wrapper.getComponent({ name: 'AvBreadcrumb' })
      expect(breadcrumb.props('links')).toStrictEqual(breadcrumbLinks)

      const pageTitle = wrapper.find('.page-title')
      const titleElement = pageTitle.find('h1')
      expect(titleElement.text()).toBe(title)
    })
  })

  BddTest().when('the component is mounted with the title slot', () => {
    const slotTitle = 'Slot Page Title'

    beforeEach(async () => {
      wrapper = await mountWithRouter(PageTitle, {
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

  BddTest().when('clicking on the back button without back provided', () => {
    let mockRouter: Partial<Router>

    beforeEach(async () => {
      mockRouter = { push: vi.fn() }
      mockedUseRouter.mockReturnValue(mockRouter as Router)

      wrapper = await mountWithRouter(PageTitle, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should call router.push with default "back" path', async () => {
      const button = wrapper.findComponent(AvButtonStub)
      await button.trigger('click')
      expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('clicking on the back button with back provided', () => {
    let mockRouter: Partial<Router>

    beforeEach(async () => {
      mockRouter = { push: vi.fn() }
      mockedUseRouter.mockReturnValue(mockRouter as Router)

      wrapper = await mountWithRouter(PageTitle, {
        props: { ...props, back },
        global: { stubs }
      })
    })

    BddTest().then('it should call router.push with provided "back" path', async () => {
      const button = wrapper.findComponent(AvButtonStub)
      await button.trigger('click')
      expect(mockRouter.push).toHaveBeenCalledWith(back)
    })
  })
})
