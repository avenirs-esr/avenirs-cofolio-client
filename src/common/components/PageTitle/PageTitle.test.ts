import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { studentHomeRoute, studentProjectSkillsRoute } from '@/features/student/routes'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { BddTest, mountWithRouter } from 'tests/utils'
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
  const back = studentProjectSkillsRoute
  const props = {
    breadcrumbLinks,
    title
  }

  beforeEach(async () => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with provided props', () => {
    beforeEach(async () => {
      wrapper = await mountWithRouter(PageTitle, {
        props,
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          }
        }
      })
    })

    BddTest().then('it should render properly', () => {
      const breadcrumb = wrapper.getComponent({ name: 'DsfrBreadcrumb' })
      expect(breadcrumb.props('links')).toStrictEqual(breadcrumbLinks)

      const pageTitle = wrapper.find('.page-title')
      const spanTitle = pageTitle.find('.n2')
      expect(spanTitle.text()).toBe(title)
    })
  })

  BddTest().when('clicking on the back button without back provided', () => {
    let mockRouter: Partial<Router>

    beforeEach(async () => {
      mockRouter = { push: vi.fn() }
      mockedUseRouter.mockReturnValue(mockRouter as Router)

      wrapper = await mountWithRouter(PageTitle, {
        props,
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          }
        }
      })
    })

    BddTest().then('it should call router.push with default "back" path', async () => {
      const button = wrapper.findComponent({ name: 'AvButton' })
      await button.trigger('click')
      expect(mockRouter.push).toHaveBeenCalledWith(studentHomeRoute)
    })
  })

  BddTest().when('clicking on the back button with back provided', () => {
    let mockRouter: Partial<Router>

    beforeEach(async () => {
      mockRouter = { push: vi.fn() }
      mockedUseRouter.mockReturnValue(mockRouter as Router)

      wrapper = await mountWithRouter(PageTitle, {
        props: { ...props, back },
        global: {
          stubs: {
            RouterLink: RouterLinkStub,
          }
        }
      })
    })

    BddTest().then('it should call router.push with provided "back" path', async () => {
      const button = wrapper.findComponent({ name: 'AvButton' })
      await button.trigger('click')
      expect(mockRouter.push).toHaveBeenCalledWith(back)
    })
  })
})
