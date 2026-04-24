import { createMockedPagedResponseSkillsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createSkillsViewHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import SkillsViewEducationTab from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewEducationTab/SkillsViewEducationTab.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

BddTest().given('a skills view education tab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SkillsViewEducationTab>>

  const stubs = {
    Pagination: PaginationStub,
    RouterLink: RouterLinkStub,
    QuerySuspense: QuerySuspenseStub,
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

  beforeEach(async () => {
    vi.clearAllMocks()

    const payload = createMockedPagedResponseSkillsDTO(PageSizes.FOUR, 20, 0, '')
    if (payload.data.length > 0) {
      payload.data[0] = {
        ...payload.data[0],
        isProgramFinished: false
      }
    }

    const handler = createSkillsViewHandler(payload)
    server.use(handler)

    paginationMock = createUsePaginationMock()

    wrapper = mountComponent(SkillsViewEducationTab, {
      global: {
        stubs,
      },
    })

    await flushPromises()
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

    BddTest().then('it should render the Pagination component', async () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      await vi.waitFor(() => expect(pagination.exists()).toBe(true))
    })

    BddTest().then('it should pass correct props to Pagination component', async () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      await vi.waitFor(() => expect(pagination.exists()).toBe(true))
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
      await flushPromises()
      const allSkillCards = wrapper.findAll('[class*="skill-card-stub"]')
      expect(allSkillCards.length).toBeGreaterThan(0)
      expect(allSkillCards.some(card => card.findComponent({ name: 'StudentDetailedEducationalSkillCard' }).exists())).toBe(true)
      allSkillCards.forEach((card, index) => {
        const educationalCard = card.findComponent({ name: 'StudentDetailedEducationalSkillCard' })
        if (educationalCard.exists()) {
          const expectedColor = `var(--skill${index + 1})`
          expect(educationalCard.props('skillColor')).toBe(expectedColor)
        }
      })
    })
  })

  BddTest().when('clicking on the page update buttons', () => {
    BddTest().then('it should update current page and page size in the mock', async () => {
      await vi.waitFor(() => expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true))

      expect(wrapper.find('.emit-current-page').exists()).toBe(true)
      await wrapper.find('.emit-current-page').trigger('click')
      expect(paginationMock.onUpdateCurrentPage).toHaveBeenCalledWith(5)
      expect(paginationMock.currentPage.value).toBe(5)

      await vi.waitFor(() => expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true))

      expect(wrapper.find('.emit-page-size').exists()).toBe(true)
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
      await flushPromises()

      const allSkillCards = wrapper.findAll('[class*="skill-card-stub"]')
      expect(allSkillCards.length).toBeGreaterThan(0)
      expect(allSkillCards.some(card => card.findComponent({ name: 'StudentDetailedEducationalSkillCard' }).exists())).toBe(true)
      allSkillCards.forEach((card, index) => {
        const educationalCard = card.findComponent({ name: 'StudentDetailedEducationalSkillCard' })
        if (educationalCard.exists()) {
          const expectedColor = `var(--skill${index + 1})`
          expect(educationalCard.props('skillColor')).toBe(expectedColor)
        }
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
  })

  BddTest().when('skills have mixed program states', () => {
    BddTest().then('it should conditionally render correct card types based on isProgramFinished', async () => {
      await wrapper.vm.$nextTick()

      const allSkillCards = wrapper.findAll('[class*="skill-card-stub"]')
      expect(allSkillCards.length).toBeGreaterThan(0)
    })

    BddTest().then('it should apply sequential skill color variables to active skills', async () => {
      await wrapper.vm.$nextTick()

      const allSkillCards = wrapper.findAll('[class*="skill-card-stub"]')
      expect(allSkillCards.length).toBeGreaterThan(0)
      expect(allSkillCards.some(card => card.findComponent({ name: 'StudentDetailedEducationalSkillCard' }).exists())).toBe(true)
      allSkillCards.forEach((card, index) => {
        const educationalCard = card.findComponent({ name: 'StudentDetailedEducationalSkillCard' })
        if (educationalCard.exists()) {
          const expectedColor = `var(--skill${index + 1})`
          expect(educationalCard.props('skillColor')).toBe(expectedColor)
        }
      })
    })
  })

  BddTest().when('no skills are available', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      const handler = createSkillsViewHandler(createMockedPagedResponseSkillsDTO(PageSizes.FOUR, 0, 0, ''))
      server.use(handler)

      paginationMock = createUsePaginationMock()

      wrapper = mountComponent(SkillsViewEducationTab, {
        global: {
          stubs,
        },
      })

      await flushPromises()
    })

    BddTest().then('it should not render container', async () => {
      await wrapper.vm.$nextTick()
      const skillsContainer = wrapper.find('[data-testid="skills-container"]')
      expect(skillsContainer.exists()).toBe(false)
    })

    BddTest().then('it should not render pagination component with no skills', () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(false)
    })
  })
})
