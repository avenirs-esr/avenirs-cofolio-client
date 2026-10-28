import type { VueWrapper } from '@vue/test-utils'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { LoaderStub } from '@avenirs-esr/shared/test-utils/unit'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { emptyLibraryActivitiesHandler, libraryActivitiesErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { EActivityThematic, EDeclaredActivityStatus, ESortField, ESortOrder, getGetDeclaredActivitiesViewUrl } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { PaginationStub } from '@/common/components/navigation/Pagination/Pagination.stub'
import { ActivityErrorMessageStub } from '@/features/student/activities/components/errors/ActivityErrorMessage/ActivityErrorMessage.stub'
import { ActivityLibraryCardStub } from '@/features/student/activities/views/ActivitiesView/components/ActivityLibraryCard/ActivityLibraryCard.stub'
import { ActivityLibraryFiltersStub } from '@/features/student/activities/views/ActivitiesView/components/ActivityLibraryFilters/ActivityLibraryFilters.stub'
import ActivityLibraryTab from '@/features/student/activities/views/ActivitiesView/components/ActivityLibraryTab/ActivityLibraryTab.vue'

const EMPTY_STATE_MESSAGE = 'Aucune inscription en cours ou terminée, allez explorer toutes les activités disponibles'
const NO_RESULT_MESSAGE = 'Aucun résultat'

const FILTERS = {
  keyword: 'maths',
  thematics: [EActivityThematic.SELF_KNOWLEDGE, EActivityThematic.PROGRAMS],
  statuses: [EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT, EDeclaredActivityStatus.CONSULTED],
  sortField: ESortField.NAME,
  sortOrder: ESortOrder.ASC,
}

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => ({
  usePagination: vi.fn(() => paginationMock),
}))

BddTest().given('an activity library tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityLibraryTab>>
  let requestedParams: URLSearchParams | undefined

  const stubs = {
    ActivityErrorMessage: ActivityErrorMessageStub,
    ActivityLibraryCard: ActivityLibraryCardStub,
    ActivityLibraryFilters: ActivityLibraryFiltersStub,
    AvIconText: AvIconTextStub,
    Loader: LoaderStub,
    Pagination: PaginationStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const mountWith = () => {
    wrapper = mountComponent(ActivityLibraryTab, {
      global: { stubs }
    })
  }

  const getRoot = () => wrapper.find('[data-testid="activity-library-tab"]')
  const getTitle = () => wrapper.findComponent(AvIconTextStub)
  const getFilters = () => wrapper.findComponent(ActivityLibraryFiltersStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getCards = () => wrapper.findAllComponents(ActivityLibraryCardStub)
  const getErrorMessage = () => wrapper.findComponent(ActivityErrorMessageStub)

  const captureRequest = ({ request }: { request: Request }) => {
    if (request.url.includes(getGetDeclaredActivitiesViewUrl())) {
      requestedParams = new URL(request.url).searchParams
    }
  }

  const applyFilters = () => {
    getFilters().vm.$emit('update:filters', FILTERS)
  }

  const waitForEmptyState = async () => {
    await vi.waitFor(() => {
      expect(getQuerySuspense().props()).toMatchObject({
        isLoading: false,
        isEmpty: true,
      })
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    paginationMock = createUsePaginationMock()
    requestedParams = undefined
    server.events.on('request:start', captureRequest)
  })

  afterEach(() => {
    server.events.removeListener('request:start', captureRequest)
  })

  BddTest().when('the component is mounted without loaded data', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the root element', () => {
      expect(getRoot().exists()).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      expect(getTitle().exists()).toBe(true)
    })

    BddTest().then('it should render the filters', () => {
      expect(getFilters().exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with loaded data', () => {
    beforeEach(async () => {
      mountWith()
      await vi.waitFor(() => {
        expect(getCards().length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should render the activity library cards', () => {
      expect(getCards().length).toBeGreaterThan(0)
    })

    BddTest().then('it should render the pagination', () => {
      expect(getPagination().exists()).toBe(true)
    })

    BddTest().then('it should not render the error message', () => {
      expect(getErrorMessage().exists()).toBe(false)
    })

    BddTest().and('another page is requested', () => {
      let initialPage: number

      beforeEach(async () => {
        initialPage = paginationMock.currentPage.value
        await getPagination().find('.emit-current-page').trigger('click')
      })

      BddTest().then('it should change the current page', () => {
        expect(paginationMock.onUpdateCurrentPage).toHaveBeenCalled()
        expect(paginationMock.currentPage.value).not.toBe(initialPage)
      })
    })

    BddTest().and('filters are applied', () => {
      beforeEach(() => {
        applyFilters()
      })

      BddTest().then('it should request the filtered activities', async () => {
        await vi.waitFor(() => {
          expect(requestedParams?.get('keyword')).toBe(FILTERS.keyword)
          expect(requestedParams?.getAll('thematics')).toEqual(FILTERS.thematics)
          expect(requestedParams?.getAll('statuses')).toEqual(FILTERS.statuses)
          expect(requestedParams?.get('sortField')).toBe(FILTERS.sortField)
          expect(requestedParams?.get('sortOrder')).toBe(FILTERS.sortOrder)
        })
      })

      BddTest().then('it should go back to the first page', () => {
        expect(paginationMock.resetCurrentPage).toHaveBeenCalled()
      })
    })

    BddTest().and('filters without result are applied', () => {
      beforeEach(async () => {
        server.use(emptyLibraryActivitiesHandler)
        applyFilters()
        await waitForEmptyState()
      })

      BddTest().then('it should render the no result message', () => {
        expect(getQuerySuspense().props('emptyStateMessage')).toBe(NO_RESULT_MESSAGE)
      })
    })
  })

  BddTest().when('the library is empty', () => {
    beforeEach(async () => {
      server.use(emptyLibraryActivitiesHandler)
      mountWith()
      await waitForEmptyState()
    })

    BddTest().then('it should render the empty state message', () => {
      expect(getQuerySuspense().props('emptyStateMessage')).toBe(EMPTY_STATE_MESSAGE)
    })
  })

  BddTest().when('there is a server error', () => {
    beforeEach(async () => {
      server.use(libraryActivitiesErrorHandler)
      mountWith()
      await vi.waitFor(() => {
        expect(getErrorMessage().exists()).toBe(true)
      })
    })

    BddTest().then('it should render the error message', () => {
      expect(getErrorMessage().exists()).toBe(true)
    })

    BddTest().then('it should not render activity cards', () => {
      expect(getCards()).toHaveLength(0)
    })
  })
})
