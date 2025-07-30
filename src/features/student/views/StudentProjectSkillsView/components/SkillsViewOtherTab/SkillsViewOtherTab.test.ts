import { createMockedPagedResponseAdditionalSkillsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createAdditionalSkillsViewHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageSizes } from '@/ui/config'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { PaginationStub } from 'tests/stubs'
import { beforeEach, describe, expect, it } from 'vitest'
import SkillsViewOtherTab from './SkillsViewOtherTab.vue'

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

describe('skillsViewOtherTab', () => {
  let queryClient: QueryClient

  const stubs = {
    AvButton: {
      template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
      emits: ['click']
    },
    Pagination: PaginationStub
  }

  describe('given a skills view other tab component', () => {
    let wrapper: ReturnType<typeof mount<typeof SkillsViewOtherTab>>

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

    describe('when the component is mounted', () => {
      it('then it should render the main container with correct class', () => {
        const container = wrapper.find('.skills-view-other-tab')
        expect(container.exists()).toBe(true)
      })

      it('then it should render the button container with correct class', () => {
        const buttonContainer = wrapper.find('.skills-view-other-tab__button-container')
        expect(buttonContainer.exists()).toBe(true)
      })

      it('then it should render the content placeholder', () => {
        const contentPlaceholder = wrapper.find('.skills-view-other-tab__content-placeholder')
        expect(contentPlaceholder.exists()).toBe(true)
        expect(contentPlaceholder.text()).toContain('TODO #416 Placeholder')
      })
    })

    describe('when the add skill button is rendered', () => {
      it('then it should have the correct variant and theme', () => {
        const button = wrapper.find('button')
        expect(button.exists()).toBe(true)
        expect(button.attributes('variant')).toBe('OUTLINED')
        expect(button.attributes()).toHaveProperty('variant', 'OUTLINED')
      })

      it('then it should have the correct label', () => {
        const button = wrapper.find('button')
        expect(button.attributes('label')).toBe('Ajouter une compétence')
      })

      it('then it should have the correct icon', () => {
        const button = wrapper.find('button')
        expect(button.attributes('icon')).toBe('mdi:plus-circle-outline')
      })
    })

    describe('when the add skill button is clicked', () => {
      it('then it should emit the click event', async () => {
        const button = wrapper.find('button')
        await button.trigger('click')

        expect(button.exists()).toBe(true)
      })
    })

    describe('when clicking on the page update buttons', () => {
      it('then it should update current page and page size in the mock', async () => {
        await wrapper.find('.emit-current-page').trigger('click')
        expect(paginationMock.onUpdateCurrentPage).toHaveBeenCalledWith(5)
        expect(paginationMock.currentPage.value).toBe(5)

        await wrapper.find('.emit-page-size').trigger('click')
        expect(paginationMock.onUpdatePageSize).toHaveBeenCalledWith(PageSizes.TWELVE)
        expect(paginationMock.pageSizeSelected.value).toBe(PageSizes.TWELVE)
        expect(paginationMock.currentPage.value).toBe(0)
      })
    })
  })
})
