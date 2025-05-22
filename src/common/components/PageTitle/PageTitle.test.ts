import { studentHomeRoute, studentProjectSkillsRoute } from '@/features/student/routes'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'
import { type Router, useRouter } from 'vue-router'
import PageTitle from './PageTitle.vue'

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}))

const mockedUseRouter: MockedFunction<typeof useRouter> = vi.mocked(useRouter)

describe('pageTitle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const breadcrumbLinks = [
    { text: 'Home', to: '/' },
    { text: 'Page name' }
  ]
  const title = 'Page title'
  const back = studentProjectSkillsRoute

  it('should render with provided props', () => {
    const props = {
      breadcrumbLinks,
      title
    }

    const wrapper = mount(PageTitle, { props, global: {
      stubs: {
        RouterLink: RouterLinkStub,
      }
    } })

    const breadcrumb = wrapper.getComponent({ name: 'DsfrBreadcrumb' })
    expect(breadcrumb.props('links')).toStrictEqual(breadcrumbLinks)

    const pageTitle = wrapper.find('.page-title')
    const spanTitle = pageTitle.find('.n2')
    expect(spanTitle.text()).toBe(title)
  })

  it('should call router.push with default "back" path', async () => {
    const mockRouter: Partial<Router> = {
      push: vi.fn(),
    }
    mockedUseRouter.mockReturnValue(mockRouter as Router)
    const wrapper = mount(PageTitle, {
      props: {
        breadcrumbLinks,
        title
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        }
      }
    })

    const button = wrapper.findComponent({ name: 'AvButton' })
    await button.trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith(studentHomeRoute)
  })

  it('should call router.push with provided "back"', async () => {
    const props = {
      breadcrumbLinks,
      title,
      back
    }

    const mockRouter: Partial<Router> = {
      push: vi.fn(),
    }
    mockedUseRouter.mockReturnValue(mockRouter as Router)
    const wrapper = mount(PageTitle, { props, global: {
      stubs: {
        RouterLink: RouterLinkStub,
      }
    } })

    const button = wrapper.findComponent({ name: 'AvButton' })
    await button.trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith(back)
  })
})
