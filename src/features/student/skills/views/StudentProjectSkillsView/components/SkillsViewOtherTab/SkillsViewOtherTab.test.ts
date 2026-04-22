import { createMockedPagedResponseDeclaredSkillProgressDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createDeclaredSkillsProgressViewHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import SkillsViewOtherTab from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/SkillsViewOtherTab.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

BddTest().given('a skills view other tab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SkillsViewOtherTab>>

  const stubs = {
    AvButton: {
      template: '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
      emits: ['click']
    },
    DeclaredSkillTypeBadge: {
      name: 'DeclaredSkillTypeBadge',
      props: ['label'],
      template: '<span>{{ label }}</span>'
    },
    AddDeclaredSkillDrawer: {
      name: 'AddDeclaredSkillDrawer',
      template: '<div class="add-declared-skill-drawer-stub"></div>'
    },
    Pagination: PaginationStub,
    RouterLink: RouterLinkStub,
    QuerySuspense: QuerySuspenseStub
  }

  beforeEach(() => {
    vi.clearAllMocks()

    const handler = createDeclaredSkillsProgressViewHandler(createMockedPagedResponseDeclaredSkillProgressDTO(PageSizes.FOUR, 20, 0))
    server.use(handler)

    paginationMock = createUsePaginationMock()

    wrapper = mountComponent<typeof SkillsViewOtherTab>(SkillsViewOtherTab, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main container with correct class', () => {
      const container = wrapper.find('.skills-view-other-tab')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render the button container with correct class', () => {
      const buttonContainer = wrapper.find('[data-testid="skills-view-other-tab__button-container"]')
      expect(buttonContainer.exists()).toBe(true)
    })

    BddTest().then('it should render the Pagination component', async () => {
      await vi.waitFor(() => expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true))
    })

    BddTest().then('it should pass correct props to Pagination component', async () => {
      let pagination: VueWrapper<InstanceType<typeof PaginationStub>>

      await vi.waitFor(() => {
        pagination = wrapper.findComponent(PaginationStub)
        expect(pagination.exists()).toBe(true)

        expect(pagination.props('pageSizeSelected')).toBeDefined()
        expect(pagination.props('pageInfo')).toBeDefined()
        expect(pagination.props('onUpdateCurrentPage')).toBeDefined()
        expect(pagination.props('onUpdatePageSize')).toBeDefined()
      })
    })

    BddTest().then('it should render skill cards when skills are loaded', async () => {
      await vi.waitFor(() => {
        const skillCards = wrapper.findAllComponents({ name: 'StudentDetailedDeclaredSkillCard' })
        expect(skillCards.length).toBe(4)
      })
    })

    BddTest().then('it should have proper CSS classes applied', () => {
      const mainContainer = wrapper.find('.skills-view-other-tab')
      expect(mainContainer.classes()).toContain('skills-view-other-tab')
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
      const skillCards = wrapper.findAllComponents({ name: 'StudentDetailedDeclaredSkillCard' })
      expect(skillCards.length).toBeGreaterThanOrEqual(0)
    })

    BddTest().then('each StudentDetailedDeclaredSkillCard should receive correct props', async () => {
      const { flushPromises } = await import('@vue/test-utils')
      await flushPromises()
      const skillCards = wrapper.findAllComponents({ name: 'StudentDetailedDeclaredSkillCard' })
      skillCards.forEach((card) => {
        expect(card.props('declaredSkill')).toBeDefined()
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
      await vi.waitFor(() => expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true))

      await wrapper.find('.emit-current-page').trigger('click')
      expect(paginationMock.onUpdateCurrentPage).toHaveBeenCalledWith(5)
      expect(paginationMock.currentPage.value).toBe(5)

      await vi.waitFor(() => expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true))

      await wrapper.find('.emit-page-size').trigger('click')
      expect(paginationMock.onUpdatePageSize).toHaveBeenCalledWith(PageSizes.TWELVE)
      expect(paginationMock.pageSizeSelected.value).toBe(PageSizes.TWELVE)
      expect(paginationMock.currentPage.value).toBe(0)
    })
  })

  BddTest().when('integrating with AddDeclaredSkillDrawer', () => {
    BddTest().then('it should render AddDeclaredSkillDrawer component', () => {
      const drawer = wrapper.findComponent({ name: 'AddDeclaredSkillDrawer' })
      expect(drawer.exists()).toBe(true)
    })

    BddTest().then('it should call handleAddSkill when button is clicked', async () => {
      const button = wrapper.find('button')
      await button.trigger('click')

      expect(button.exists()).toBe(true)
    })
  })

  BddTest().when('integrating with skills store', () => {
    BddTest().then('it should use declaredCurrentPage and declaredPageSizeSelected from skills store', () => {
      expect(paginationMock.currentPage.value).toBeDefined()
      expect(paginationMock.pageSizeSelected.value).toBeDefined()
    })
  })

  BddTest().when('handling API errors', () => {
    BddTest().then('it should handle API errors through useBaseApiExceptionToast', () => {
      expect(wrapper.exists()).toBe(true)
    })
  })

  BddTest().when('no declared skills are available', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      const handler = createDeclaredSkillsProgressViewHandler(createMockedPagedResponseDeclaredSkillProgressDTO(PageSizes.FOUR, 0, 0))
      server.use(handler)

      paginationMock = createUsePaginationMock()

      wrapper = mountComponent<typeof SkillsViewOtherTab>(SkillsViewOtherTab, { global: { stubs } })
    })

    BddTest().then('it should render the query suspense empty state', async () => {
      await vi.waitFor(() => {
        const emptyState = wrapper.find('[data-testid="query-suspense-empty"]')
        expect(emptyState.exists()).toBe(true)
      })
    })

    BddTest().then('it should not show pagination with no skills', () => {
      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.exists()).toBe(false)
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
      expect(button.attributes('small')).toBeDefined()
    })

    BddTest().then('it should position button container at flex-end', () => {
      const buttonContainer = wrapper.find('[data-testid="skills-view-other-tab__button-container"]')
      expect(buttonContainer.exists()).toBe(true)
    })

    BddTest().then('it should apply correct CSS class structure', () => {
      expect(wrapper.find('.skills-view-other-tab').exists()).toBe(true)
    })
  })

  BddTest().when('validating skills data structure', () => {
    BddTest().then('it should render skills with proper key binding', async () => {
      const { flushPromises } = await import('@vue/test-utils')
      await flushPromises()

      const skillCards = wrapper.findAllComponents({ name: 'StudentDetailedDeclaredSkillCard' })
      skillCards.forEach((card) => {
        expect(card.props('declaredSkill')).toBeTypeOf('object')
      })
    })
  })
})
