import { createMockedPagedResponseSkillsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createSkillsViewHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import SkillsViewEducationTab from '@/features/student/views/StudentProjectSkillsView/components/SkillsViewEducationTab/SkillsViewEducationTab.vue'
import { PageSizes } from '@/ui/config'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { PaginationStub } from 'tests/stubs'
import { beforeEach, describe, expect, it } from 'vitest'

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

describe('skillsViewEducationTab', () => {
  let queryClient: QueryClient

  const stubs = {
    Pagination: PaginationStub
  }

  describe('given a skills view education tab component', () => {
    let wrapper: VueWrapper<InstanceType<typeof SkillsViewEducationTab>>

    beforeEach(() => {
      vi.clearAllMocks()
      queryClient = new QueryClient()

      const handler = createSkillsViewHandler(createMockedPagedResponseSkillsDTO(PageSizes.FOUR, 20, 0, ''))
      server.use(handler)

      paginationMock = createUsePaginationMock()

      setActivePinia(createPinia())

      wrapper = mount(SkillsViewEducationTab, {
        global: {
          stubs,
          plugins: [createPinia(), [VueQueryPlugin, { queryClient }]]
        },
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the main container', () => {
        const container = wrapper.find('.main-container')
        expect(container.exists()).toBe(true)
      })

      it('then it should render the title container and the title', () => {
        const container = wrapper.find('.title-container')
        expect(container.exists()).toBe(true)
        const title = container.find('.n5')
        expect(title.exists()).toBe(true)
        expect(title.text()).toContain('Les compétences de mes formations')
        const subtitle = title.find('.b1-regular')
        expect(subtitle.exists()).toBe(true)
        expect(subtitle.text()).toContain('(validées et en cours)')
      })

      it('then it should render the skills container', () => {
        const container = wrapper.find('.skills-container')
        expect(container.exists()).toBe(true)
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
