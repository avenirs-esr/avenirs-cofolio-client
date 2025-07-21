import { mockedProgramsProgressView } from '@/__mocks__/fixtures/student'
import { createProgramProgressViewHandler, programProgressViewErrorHandler } from '@/__mocks__/msw/handlers'
import { server } from '@/__mocks__/msw/server'
import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { studentHomeRoute } from '@/features/student/routes'
import { StudentProgressViewSortableFields } from '@/features/student/types'
import StudentEducationSkillsView from '@/features/student/views/StudentEducationSkillsView/StudentEducationSkillsView.vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

export const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage
    })
  }
})

describe('studentEducationSkillsView', () => {
  describe('given a student education skills view', () => {
    const stubs = {
      StudentEducationSkillsViewContainer: {
        name: 'StudentEducationSkillsViewContainer',
        template: `<div class="student-education-skills-view-container"/>`,
        props: ['course'],
      },
      StudentEducationSkillsFiltersContainer: {
        name: 'StudentEducationSkillsFiltersContainer',
        template: `<div class="student-education-skills-filters-container"/>`,
        props: ['sort'],
        emits: ['update:sort']
      },
      RouterLink: RouterLinkStub,
      PageTitle: {
        name: 'PageTitle',
        template: '<div />',
        props: ['title', 'breadcrumbLinks']
      }
    }

    const createWrapper = () => mount(StudentEducationSkillsView, {
      global: {
        stubs,
        plugins: [createPinia(), [VueQueryPlugin, { queryClient: new QueryClient({
          defaultOptions: {
            queries: {
              retry: false,
            },
          },
        })
        }]]
      }
    })

    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
    })

    const title = 'Mes compétences visées par ma formation'
    const title_plural = 'Mes compétences visées par mes formations'
    const homeBreadcrumbLink = { text: 'Accueil', to: studentHomeRoute }
    const currentBreadcrumbLink = { text: 'Mes compétences' }

    describe('when the view is mounted with empty data', () => {
      beforeEach(() => {
        const handler = createProgramProgressViewHandler([])
        server.use(handler)
      })

      it('then it should render PageTitle with singular title', () => {
        const wrapper = createWrapper()
        const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

        expect(pageTitle.props('title')).toBe(title)
        expect(pageTitle.props('breadcrumbLinks')).toEqual([
          homeBreadcrumbLink,
          currentBreadcrumbLink
        ])
      })

      it('then it should not render any StudentEducationSkillsViewContainer', () => {
        const wrapper = createWrapper()
        const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })

        expect(containers).toHaveLength(0)
      })

      it('then it should render StudentEducationSkillsFiltersContainer', () => {
        const wrapper = createWrapper()
        const filtersContainer = wrapper.findComponent({ name: 'StudentEducationSkillsFiltersContainer' })

        expect(filtersContainer.exists()).toBe(true)
      })
    })

    describe('when the view is mounted with one course', () => {
      beforeEach(() => {
        const handler = createProgramProgressViewHandler([mockedProgramsProgressView[0]])
        server.use(handler)
      })

      it('then it should render 1 StudentEducationSkillsViewContainer', async () => {
        const wrapper = createWrapper()

        await vi.waitFor(() => {
          const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })
          expect(containers).toHaveLength(1)
        })
      })
    })

    describe('when the view is mounted with multiple courses', () => {
      beforeEach(() => {
        const handler = createProgramProgressViewHandler(mockedProgramsProgressView)
        server.use(handler)
      })

      it('then it should render PageTitle with plural title', async () => {
        const wrapper = createWrapper()

        await vi.waitFor(() => {
          const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
          expect(pageTitle.props('title')).toBe(title_plural)
        })
      })

      it('then it should render multiple StudentEducationSkillsViewContainer', async () => {
        const wrapper = createWrapper()

        await vi.waitFor(() => {
          const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })
          expect(containers).toHaveLength(mockedProgramsProgressView.length)
        })
      })
    })

    describe('when the filters container emits sort change', () => {
      it('then it should update the sort parameter and trigger new query', async () => {
        const handler = createProgramProgressViewHandler(mockedProgramsProgressView)
        server.use(handler)

        const wrapper = createWrapper()

        const filtersContainer = wrapper.findComponent({ name: 'StudentEducationSkillsFiltersContainer' })

        const defaultSort = formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC)
        expect(filtersContainer.props('sort')).toBe(defaultSort)

        const newSort = formatSortParam(StudentProgressViewSortableFields.DATE, SortDirection.DESC)
        await filtersContainer.vm.$emit('update:sort', newSort)

        expect(filtersContainer.props('sort')).toBe(newSort)
      })
    })

    describe('when the API returns an error', () => {
      beforeEach(() => {
        server.use(programProgressViewErrorHandler)
      })

      it('then it should call addErrorMessage with error toast', async () => {
        const wrapper = createWrapper()
        await flushPromises()

        await vi.waitFor(() => {
          expect(mockAddErrorMessage).toHaveBeenCalled()
        })

        const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })
        expect(containers).toHaveLength(0)

        const filtersContainer = wrapper.findComponent({ name: 'StudentEducationSkillsFiltersContainer' })
        expect(filtersContainer.exists()).toBe(true)
      })
    })
  })
})
