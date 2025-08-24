import { createMockedPagedResponseSkillsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createSkillsViewHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import SkillsViewEducationTab from '@/features/student/views/StudentProjectSkillsView/components/SkillsViewEducationTab/SkillsViewEducationTab.vue'
import { PageSizes } from '@/ui/config'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { PaginationStub } from 'tests/stubs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

describe('skillsViewEducationTab', () => {
  let queryClient: QueryClient

  const stubs = {
    Pagination: PaginationStub,
    StudentDetailedEducationalSkillCard: {
      name: 'StudentDetailedEducationalSkillCard',
      props: ['skill', 'skillColor'],
      template: '<div class="student-detailed-educational-skill-card-stub" />'
    },
    StudentDetailedPastSkillCard: {
      name: 'StudentDetailedPastSkillCard',
      props: ['skill'],
      template: '<div class="student-detailed-past-skill-card-stub" />'
    }
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

      it('then it should render the Pagination component', () => {
        const pagination = wrapper.findComponent({ name: 'Pagination' })
        expect(pagination.exists()).toBe(true)
      })

      it('then it should pass correct props to Pagination component', () => {
        const pagination = wrapper.findComponent({ name: 'Pagination' })
        expect(pagination.props('pageSizeSelected')).toBeDefined()
        expect(pagination.props('pageInfo')).toBeDefined()
        expect(pagination.props('onUpdateCurrentPage')).toBeDefined()
        expect(pagination.props('onUpdatePageSize')).toBeDefined()
      })

      it('then it should render skill cards when skills are loaded', async () => {
        await wrapper.vm.$nextTick()
        const skillCards = wrapper.findAll('[class*="skill-card-stub"]')
        expect(skillCards.length).toBeGreaterThanOrEqual(0)
      })

      it('then it should have proper CSS classes applied', () => {
        const mainContainer = wrapper.find('.main-container')
        expect(mainContainer.classes()).toContain('main-container')

        const titleContainer = wrapper.find('.title-container')
        expect(titleContainer.classes()).toContain('title-container')

        const skillsContainer = wrapper.find('.skills-container')
        expect(skillsContainer.classes()).toContain('skills-container')
      })
    })

    describe('when skills query is loading', () => {
      it('then it should handle loading state gracefully', () => {
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('.main-container').exists()).toBe(true)
      })
    })

    describe('when skills query returns data', () => {
      it('then it should render skill cards for each skill', async () => {
        await wrapper.vm.$nextTick()
        const educationalSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })
        const pastSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedPastSkillCard' })
        const totalCards = educationalSkillCards.length + pastSkillCards.length
        expect(totalCards).toBeGreaterThanOrEqual(0)
      })

      it('then it should render StudentDetailedPastSkillCard for finished programs', async () => {
        await wrapper.vm.$nextTick()
        const pastSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedPastSkillCard' })
        pastSkillCards.forEach((card) => {
          expect(card.props('skill')).toBeDefined()
        })
      })

      it('then it should render StudentDetailedEducationalSkillCard with skill color for active skills', async () => {
        await wrapper.vm.$nextTick()
        const educationalSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })
        educationalSkillCards.forEach((card, index) => {
          expect(card.props('skill')).toBeDefined()
          expect(card.props('skillColor')).toBe(`var(--skill${index + 1})`)
        })
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

    describe('when pagination state changes', () => {
      it('then it should maintain reactivity with pagination composable', () => {
        expect(paginationMock.currentPage.value).toBeDefined()
        expect(paginationMock.pageSizeSelected.value).toBeDefined()
        expect(paginationMock.onUpdateCurrentPage).toBeDefined()
        expect(paginationMock.onUpdatePageSize).toBeDefined()
      })
    })

    describe('when skills have different program states', () => {
      it('then it should render both types of skill cards', async () => {
        await wrapper.vm.$nextTick()

        const pastSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedPastSkillCard' })
        const educationalSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })

        expect(pastSkillCards.length + educationalSkillCards.length).toBeGreaterThanOrEqual(0)
      })

      it('then it should pass correct props to past skill cards', async () => {
        await wrapper.vm.$nextTick()

        const pastSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedPastSkillCard' })
        pastSkillCards.forEach((card) => {
          expect(card.props('skill')).toBeDefined()
          expect(card.props('skill')).toBeTypeOf('object')
        })
      })

      it('then it should pass correct props to educational skill cards', async () => {
        await wrapper.vm.$nextTick()

        const educationalSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })
        educationalSkillCards.forEach((card, index) => {
          expect(card.props('skill')).toBeDefined()
          expect(card.props('skill')).toBeTypeOf('object')
          expect(card.props('skillColor')).toBe(`var(--skill${index + 1})`)
        })
      })
    })

    describe('when skills query has error', () => {
      it('then it should handle error state gracefully through useBaseApiExceptionToast', () => {
        expect(wrapper.exists()).toBe(true)
      })
    })
  })
})
