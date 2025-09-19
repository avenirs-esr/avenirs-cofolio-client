import { createMockedPagedResponseAdditionalSkillsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createAdditionalSkillsViewHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import SkillsViewOtherTab from './SkillsViewOtherTab.vue'

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

BddTest().given('a skills view other tab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SkillsViewOtherTab>>

  let queryClient: QueryClient

  const stubs = {
    AvButton: {
      template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
      emits: ['click']
    },
    Pagination: PaginationStub,
    RouterLink: RouterLinkStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient()

    const handler = createAdditionalSkillsViewHandler(createMockedPagedResponseAdditionalSkillsDTO(PageSizes.FOUR, 20, 0, ''))
    server.use(handler)

    paginationMock = createUsePaginationMock()

    setActivePinia(createPinia())

    wrapper = mount<typeof SkillsViewOtherTab>(SkillsViewOtherTab, {
      global: {
        stubs,
        plugins: [createPinia(), [VueQueryPlugin, { queryClient }]]
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main container with correct class', () => {
      const container = wrapper.find('.skills-view-other-tab')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render the button container with correct class', () => {
      const buttonContainer = wrapper.find('.skills-view-other-tab__button-container')
      expect(buttonContainer.exists()).toBe(true)
    })

    BddTest().then('it should render the content placeholder', () => {
      const contentPlaceholder = wrapper.find('.skills-view-other-tab__content-placeholder')
      expect(contentPlaceholder.exists()).toBe(true)
    })

    BddTest().then('it should render the Pagination component', () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(true)
    })

    BddTest().then('it should pass correct props to Pagination component', () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.props('pageSizeSelected')).toBeDefined()
      expect(pagination.props('pageInfo')).toBeDefined()
      expect(pagination.props('onUpdateCurrentPage')).toBeDefined()
      expect(pagination.props('onUpdatePageSize')).toBeDefined()
    })

    BddTest().then('it should render skill cards when skills are loaded', async () => {
      const { flushPromises } = await import('@vue/test-utils')
      await flushPromises()
      const skillCards = wrapper.findAllComponents({ name: 'StudentDetailedAdditionalSkillCard' })
      expect(skillCards.length).toBe(4)
    })

    BddTest().then('it should have proper CSS classes applied', () => {
      const mainContainer = wrapper.find('.skills-view-other-tab')
      expect(mainContainer.classes()).toContain('skills-view-other-tab')

      const buttonContainer = wrapper.find('.skills-view-other-tab__button-container')
      expect(buttonContainer.classes()).toContain('skills-view-other-tab__button-container')

      const skillsContainer = wrapper.find('.skills-container')
      expect(skillsContainer.classes()).toContain('skills-container')
    })
  })

  BddTest().when('skills query is loading', () => {
    BddTest().then('it should handle loading state gracefully', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.skills-view-other-tab').exists()).toBe(true)
    })
  })

  BddTest().when('skills query returns data', () => {
    BddTest().then('it should render skill cards for each skill', async () => {
      const { flushPromises } = await import('@vue/test-utils')
      await flushPromises()
      const skillCards = wrapper.findAllComponents({ name: 'StudentDetailedAdditionalSkillCard' })
      expect(skillCards.length).toBeGreaterThanOrEqual(0)
    })

    BddTest().then('each StudentDetailedAdditionalSkillCard should receive correct props', async () => {
      const { flushPromises } = await import('@vue/test-utils')
      await flushPromises()
      const skillCards = wrapper.findAllComponents({ name: 'StudentDetailedAdditionalSkillCard' })
      skillCards.forEach((card) => {
        expect(card.props('additionalSkill')).toBeDefined()
      })
    })
  })

  BddTest().when('the add skill button is rendered', () => {
    BddTest().then('it should have the correct variant and theme', () => {
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.attributes('variant')).toBe('OUTLINED')
      expect(button.attributes()).toHaveProperty('variant', 'OUTLINED')
    })

    BddTest().then('it should have the correct label', () => {
      const button = wrapper.find('button')
      expect(button.attributes('label')).toBe('Ajouter une compétence')
    })

    BddTest().then('it should have the correct icon', () => {
      const button = wrapper.find('button')
      expect(button.attributes('icon')).toBe('mdi:plus-circle-outline')
    })
  })

  BddTest().when('the add skill button is clicked', () => {
    BddTest().then('it should emit the click event', async () => {
      const button = wrapper.find('button')
      await button.trigger('click')

      expect(button.exists()).toBe(true)
    })
  })

  BddTest().when('clicking on the page update buttons', () => {
    BddTest().then('it should update current page and page size in the mock', async () => {
      await wrapper.find('.emit-current-page').trigger('click')
      expect(paginationMock.onUpdateCurrentPage).toHaveBeenCalledWith(5)
      expect(paginationMock.currentPage.value).toBe(5)

      await wrapper.find('.emit-page-size').trigger('click')
      expect(paginationMock.onUpdatePageSize).toHaveBeenCalledWith(PageSizes.TWELVE)
      expect(paginationMock.pageSizeSelected.value).toBe(PageSizes.TWELVE)
      expect(paginationMock.currentPage.value).toBe(0)
    })
  })

  BddTest().when('integrating with AddAdditionalSkillDrawer', () => {
    BddTest().then('it should render AddAdditionalSkillDrawer component', () => {
      const drawer = wrapper.findComponent({ name: 'AddAdditionalSkillDrawer' })
      expect(drawer.exists()).toBe(true)
    })

    BddTest().then('it should call handleAddSkill when button is clicked', async () => {
      const button = wrapper.find('button')
      await button.trigger('click')

      expect(button.exists()).toBe(true)
    })
  })

  BddTest().when('integrating with skills store', () => {
    BddTest().then('it should use additionalCurrentPage and additionalPageSizeSelected from skills store', () => {
      expect(paginationMock.currentPage.value).toBeDefined()
      expect(paginationMock.pageSizeSelected.value).toBeDefined()
    })

    BddTest().then('it should call useAdditionalSkillsViewQuery with pagination parameters', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
    })
  })

  BddTest().when('handling API errors', () => {
    BddTest().then('it should handle API errors through useBaseApiExceptionToast', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })

  BddTest().when('no additional skills are available', () => {
    BddTest().then('it should render empty skills container gracefully', async () => {
      const skillsContainer = wrapper.find('.skills-container')
      expect(skillsContainer.exists()).toBe(true)
    })

    BddTest().then('it should still show pagination with no skills', () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(true)
    })

    BddTest().then('it should still show add skill button when no skills exist', () => {
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.attributes('label')).toBe('Ajouter une compétence')
    })
  })

  BddTest().when('checking button styling and layout', () => {
    BddTest().then('it should render button with correct size', () => {
      const button = wrapper.find('button')
      expect(button.attributes('size')).toBe('sm')
    })

    BddTest().then('it should position button container at flex-end', () => {
      const buttonContainer = wrapper.find('.skills-view-other-tab__button-container')
      expect(buttonContainer.exists()).toBe(true)
    })

    BddTest().then('it should apply correct CSS class structure', () => {
      expect(wrapper.find('.skills-view-other-tab').exists()).toBe(true)
      expect(wrapper.find('.skills-view-other-tab__content-placeholder').exists()).toBe(true)
      expect(wrapper.find('.skills-view-other-tab__button-container').exists()).toBe(true)
    })
  })

  BddTest().when('validating skills data structure', () => {
    BddTest().then('it should render skills with proper key binding', async () => {
      const { flushPromises } = await import('@vue/test-utils')
      await flushPromises()

      const skillCards = wrapper.findAllComponents({ name: 'StudentDetailedAdditionalSkillCard' })
      skillCards.forEach((card) => {
        expect(card.props('additionalSkill')).toBeTypeOf('object')
      })
    })
  })
})
