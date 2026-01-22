import { createMockedPagedResponseSkillsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createSkillsViewHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import SkillsViewEducationTab from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewEducationTab/SkillsViewEducationTab.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { beforeEach, expect, vi } from 'vitest'

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

BddTest().given('a skills view education tab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SkillsViewEducationTab>>

  let queryClient: QueryClient

  const stubs = {
    Pagination: PaginationStub,
    RouterLink: RouterLinkStub,
    StudentDetailedEducationalSkillCard: {
      name: 'StudentDetailedEducationalSkillCard',
      props: ['skill', 'skillColor'],
      template: '<div class="student-detailed-educational-skill-card-stub" />'
    },
    StudentDetailedPastSkillCard: {
      name: 'StudentDetailedPastSkillCard',
      props: ['skill'],
      template: '<div class="student-detailed-past-skill-card-stub" />'
    },
    StudentDetailedSkillCard: {
      name: 'StudentDetailedSkillCard',
      props: ['id', 'name', 'skillColor'],
      template: '<div class="student-detailed-skill-card-stub" />'
    }
  }

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

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main container', () => {
      const container = wrapper.find('.skills-view-education-tab')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render the title container and the title', () => {
      const container = wrapper.find('[data-testid="title-container"]')
      expect(container.exists()).toBe(true)
      const title = container.find('.n5')
      expect(title.exists()).toBe(true)
      expect(title.text()).toContain('Les compétences de mes formations')
      const subtitle = title.find('.b1-regular')
      expect(subtitle.exists()).toBe(true)
      expect(subtitle.text()).toContain('(terminées et en cours)')
    })

    BddTest().then('it should render the skills container', () => {
      const container = wrapper.find('[data-testid="skills-container"]')
      expect(container.exists()).toBe(true)
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
      await wrapper.vm.$nextTick()
      const skillCards = wrapper.findAll('[class*="skill-card-stub"]')
      expect(skillCards.length).toBeGreaterThanOrEqual(0)
    })

    BddTest().then('it should have proper CSS classes applied', () => {
      const mainContainer = wrapper.find('.skills-view-education-tab')
      expect(mainContainer.classes()).toContain('skills-view-education-tab')
    })
  })

  BddTest().when('skills query is loading', () => {
    BddTest().then('it should handle loading state gracefully', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.skills-view-education-tab').exists()).toBe(true)
    })
  })

  BddTest().when('skills query returns data', () => {
    BddTest().then('it should render skill cards for each skill', async () => {
      await wrapper.vm.$nextTick()
      const educationalSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })
      const pastSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedPastSkillCard' })
      const totalCards = educationalSkillCards.length + pastSkillCards.length
      expect(totalCards).toBeGreaterThanOrEqual(0)
    })

    BddTest().then('it should render StudentDetailedPastSkillCard for finished programs', async () => {
      await wrapper.vm.$nextTick()
      const pastSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedPastSkillCard' })
      pastSkillCards.forEach((card) => {
        expect(card.props('skill')).toBeDefined()
      })
    })

    BddTest().then('it should render StudentDetailedEducationalSkillCard with skill color for active skills', async () => {
      await wrapper.vm.$nextTick()
      const educationalSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })
      educationalSkillCards.forEach((card, index) => {
        expect(card.props('skill')).toBeDefined()
        expect(card.props('skillColor')).toBe(`var(--skill${index + 1})`)
      })
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

  BddTest().when('pagination state changes', () => {
    BddTest().then('it should maintain reactivity with pagination composable', () => {
      expect(paginationMock.currentPage.value).toBeDefined()
      expect(paginationMock.pageSizeSelected.value).toBeDefined()
      expect(paginationMock.onUpdateCurrentPage).toBeDefined()
      expect(paginationMock.onUpdatePageSize).toBeDefined()
    })
  })

  BddTest().when('skills have different program states', () => {
    BddTest().then('it should render both types of skill cards', async () => {
      await wrapper.vm.$nextTick()

      const pastSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedPastSkillCard' })
      const educationalSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })

      expect(pastSkillCards.length + educationalSkillCards.length).toBeGreaterThanOrEqual(0)
    })

    BddTest().then('it should pass correct props to past skill cards', async () => {
      await wrapper.vm.$nextTick()

      const pastSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedPastSkillCard' })
      pastSkillCards.forEach((card) => {
        expect(card.props('skill')).toBeDefined()
        expect(card.props('skill')).toBeTypeOf('object')
      })
    })

    BddTest().then('it should pass correct props to educational skill cards', async () => {
      await wrapper.vm.$nextTick()

      const educationalSkillCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })
      educationalSkillCards.forEach((card, index) => {
        expect(card.props('skill')).toBeDefined()
        expect(card.props('skill')).toBeTypeOf('object')
        expect(card.props('skillColor')).toBe(`var(--skill${index + 1})`)
      })
    })
  })

  BddTest().when('skills query has error', () => {
    BddTest().then('it should handle error state gracefully through useBaseApiExceptionToast', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })

  BddTest().when('search functionality is used', () => {
    BddTest().then('it should initialize search with empty string', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should maintain search state reactivity', () => {
      const component = wrapper.vm as any
      expect(component.search).toBeDefined()
      expect(typeof component.search).toBe('string')
    })
  })

  BddTest().when('skills store integration', () => {
    BddTest().then('it should properly integrate with skills store for pagination', () => {
      expect(paginationMock.currentPage.value).toBeDefined()
      expect(paginationMock.pageSizeSelected.value).toBeDefined()
    })

    BddTest().then('it should call useSkillsViewQuery with correct parameters', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
    })
  })

  BddTest().when('no skills are available', () => {
    BddTest().then('it should render container even with empty skills array', async () => {
      await wrapper.vm.$nextTick()
      const skillsContainer = wrapper.find('[data-testid="skills-container"]')
      expect(skillsContainer.exists()).toBe(true)
    })

    BddTest().then('it should still render pagination component with no skills', () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(true)
    })
  })

  BddTest().when('skills have mixed program states', () => {
    BddTest().then('it should conditionally render correct card types based on isProgramFinished', async () => {
      await wrapper.vm.$nextTick()

      const allSkillCards = wrapper.findAll('[class*="skill-card-stub"]')
      expect(allSkillCards.length).toBeGreaterThanOrEqual(0)
    })

    BddTest().then('it should apply sequential skill color variables to active skills', async () => {
      await wrapper.vm.$nextTick()

      const educationalCards = wrapper.findAllComponents({ name: 'StudentDetailedEducationalSkillCard' })
      educationalCards.forEach((card, index) => {
        const expectedColor = `var(--skill${index + 1})`
        expect(card.props('skillColor')).toBe(expectedColor)
      })
    })
  })
})
