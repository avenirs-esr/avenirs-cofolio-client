import { ROUTES } from '@/common/constants'
import NotFoundView from '@/common/views/NotFoundView/NotFoundView.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { type MockedFunction, vi } from 'vitest'
import { type Router, useRouter } from 'vue-router'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: vi.fn(),
  }
})

const mockedUseRouter: MockedFunction<typeof useRouter> = vi.mocked(useRouter)
let mockRouter: Partial<Router>

BddTest().given('a not found view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NotFoundView>>
  const routerPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockRouter = { push: routerPush }
    mockedUseRouter.mockReturnValue(mockRouter as Router)
  })

  BddTest().when('the view is mounted with default props', () => {
    beforeEach(() => {
      wrapper = mount(NotFoundView, {
        global: {
          stubs: {
            AvButton: AvButtonStub,
          },
        },
      })
    })

    BddTest().then('it should render default title/description and the button label', () => {
      expect(wrapper.find('h3').text()).toBe('404 - Page introuvable')
      expect(wrapper.find('p').text()).toBe('La page que vous recherchez n\'existe pas ou plus.')
      expect(wrapper.findComponent(AvButtonStub).text()).toBe('Retour à l\'accueil')
    })

    BddTest().and('when the user clicks the button', () => {
      beforeEach(async () => {
        await wrapper.findComponent(AvButtonStub).trigger('click')
      })

      BddTest().then('it should navigate back to student home', () => {
        expect(routerPush).toHaveBeenCalledWith({ name: ROUTES.STUDENT.HOME.name })
      })
    })
  })

  BddTest().when('the view is mounted with custom translation keys', () => {
    beforeEach(() => {
      wrapper = mount(NotFoundView, {
        props: {
          titleKey: 'global.views.notFoundView.resourceNotFound.title',
          descriptionKey: 'global.views.notFoundView.resourceNotFound.description',
        },
        global: {
          stubs: {
            AvButton: AvButtonStub,
          },
        },
      })
    })

    BddTest().then('it should render the title/description from the given keys', () => {
      expect(wrapper.find('h3').text()).toBe('404 - Ressource introuvable')
      expect(wrapper.find('p').text()).toBe('La ressource que vous recherchez n\'existe pas ou a été supprimée.')
    })
  })
})
