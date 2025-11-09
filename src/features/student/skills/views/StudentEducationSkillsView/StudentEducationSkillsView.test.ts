import { mockedProgramsProgressView } from '@/__mocks__/fixtures/student'
import { createProgramProgressViewHandler, programProgressViewErrorHandler } from '@/__mocks__/msw/handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { studentHomeRoute } from '@/features/student/routes'
import { StudentProgressViewSortableFields } from '@/features/student/skills'
import { SkillsSortContainerStub } from '@/features/student/skills/views/StudentEducationSkillsView/components/SkillsSortContainer/SkillsSortContainer.stub'
import { StudentEducationSkillsViewContainerStub } from '@/features/student/skills/views/StudentEducationSkillsView/components/StudentEducationSkillsViewContainer/StudentEducationSkillsViewContainer.stub'
import StudentEducationSkillsView from '@/features/student/skills/views/StudentEducationSkillsView/StudentEducationSkillsView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises, mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

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

BddTest().given('a student education skills view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentEducationSkillsView>>

  const stubs = {
    StudentEducationSkillsViewContainer: StudentEducationSkillsViewContainerStub,
    SkillsSortContainer: SkillsSortContainerStub,
    RouterLink: RouterLinkStub,
    PageTitle: PageTitleStub
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

  BddTest().when('the view is mounted', () => {
    BddTest().and('has empty data', () => {
      beforeEach(() => {
        const handler = createProgramProgressViewHandler([])
        server.use(handler)
      })

      BddTest().then('it should render PageTitle with singular title', () => {
        wrapper = createWrapper()
        const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

        expect(pageTitle.props('title')).toBe(title)
        expect(pageTitle.props('breadcrumbLinks')).toEqual([
          homeBreadcrumbLink,
          currentBreadcrumbLink
        ])
      })

      BddTest().then('it should not render any StudentEducationSkillsViewContainer', () => {
        wrapper = createWrapper()
        const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })

        expect(containers).toHaveLength(0)
      })

      BddTest().then('it should render SkillsSortContainer', () => {
        wrapper = createWrapper()
        const filtersContainer = wrapper.findComponent({ name: 'SkillsSortContainer' })

        expect(filtersContainer.exists()).toBe(true)
      })
    })

    BddTest().and('has one course', () => {
      beforeEach(() => {
        const handler = createProgramProgressViewHandler([mockedProgramsProgressView[0]])
        server.use(handler)
      })

      BddTest().then('it should render 1 StudentEducationSkillsViewContainer', async () => {
        wrapper = createWrapper()

        await vi.waitFor(() => {
          const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })
          expect(containers).toHaveLength(1)
        })
      })
    })

    BddTest().and('has multiple courses', () => {
      beforeEach(() => {
        const handler = createProgramProgressViewHandler(mockedProgramsProgressView)
        server.use(handler)
      })

      BddTest().then('it should render PageTitle with plural title', async () => {
        wrapper = createWrapper()

        await vi.waitFor(() => {
          const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
          expect(pageTitle.props('title')).toBe(title_plural)
        })
      })

      BddTest().then('it should render multiple StudentEducationSkillsViewContainer', async () => {
        wrapper = createWrapper()

        await vi.waitFor(() => {
          const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })
          expect(containers).toHaveLength(mockedProgramsProgressView.length)
        })
      })
    })
  })

  BddTest().when('the filters container emits sort change', () => {
    BddTest().then('it should update the sort parameter and trigger new query', async () => {
      const handler = createProgramProgressViewHandler(mockedProgramsProgressView)
      server.use(handler)

      wrapper = createWrapper()

      const filtersContainer = wrapper.findComponent({ name: 'SkillsSortContainer' })

      const defaultSort = formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC)
      expect(filtersContainer.props('sort')).toBe(defaultSort)

      const newSort = formatSortParam(StudentProgressViewSortableFields.DATE, SortDirection.DESC)
      await filtersContainer.vm.$emit('update:sort', newSort)

      expect(filtersContainer.props('sort')).toBe(newSort)
    })
  })

  BddTest().when('the API returns an error', () => {
    beforeEach(() => {
      server.use(programProgressViewErrorHandler)
    })

    BddTest().then('it should call addErrorMessage with error toast', async () => {
      wrapper = createWrapper()
      await flushPromises()

      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })

      const containers = wrapper.findAllComponents({ name: 'StudentEducationSkillsViewContainer' })
      expect(containers).toHaveLength(0)

      const filtersContainer = wrapper.findComponent({ name: 'SkillsSortContainer' })
      expect(filtersContainer.exists()).toBe(true)
    })
  })
})
