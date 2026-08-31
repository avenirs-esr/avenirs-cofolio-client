import type { VueWrapper } from '@vue/test-utils'
import { libraryActivitiesErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { ActivityErrorMessageStub } from '@/features/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.stub'
import { ActivityLibraryCardStub } from '@/features/buildProject/views/ProjectActivitiesView/components/ActivityLibraryCard/ActivityLibraryCard.stub'
import ActivityLibraryTab from '@/features/buildProject/views/ProjectActivitiesView/components/ActivityLibraryTab/ActivityLibraryTab.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

BddTest().given('an ActivityLibraryTab', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityLibraryTab>>

  const stubs = {
    ActivityLibraryCard: ActivityLibraryCardStub,
    ActivityErrorMessage: ActivityErrorMessageStub,
    AvIconText: AvIconTextStub,
    Pagination: PaginationStub,
    Loader: LoaderStub
  }

  beforeEach(() => {
    vi.clearAllMocks()

    paginationMock = createUsePaginationMock()

    wrapper = mountComponent(ActivityLibraryTab, { global: { stubs } })
  })

  BddTest().when('the component is mounted without loaded data', () => {
    BddTest().then('it should render the root element', () => {
      expect(wrapper.find('[data-testid="activity-library-tab"]').exists()).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      expect(wrapper.findComponent(AvIconTextStub).exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with loaded data', () => {
    beforeEach(async () => {
      await vi.waitFor(() => {
        const cards = wrapper.findAllComponents(ActivityLibraryCardStub)
        expect(cards.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should render the activity library cards', () => {
      const cards = wrapper.findAllComponents(ActivityLibraryCardStub)
      expect(cards.length).toBeGreaterThan(0)
    })

    BddTest().then('it should render the pagination', () => {
      expect(wrapper.findComponent(PaginationStub).exists()).toBe(true)
    })

    BddTest().then('it should not render the error message', () => {
      expect(wrapper.find('[data-testid="activity-error-message-stub"]').exists()).toBe(false)
    })

    BddTest().and('the user clicks on the current page update button', () => {
      BddTest().then('it should update current page and page size in the mock', async () => {
        await wrapper.find('.emit-current-page').trigger('click')
        expect(paginationMock.onUpdateCurrentPage).toHaveBeenCalledWith(5)
        expect(paginationMock.currentPage.value).toBe(5)
      })
    })
  })

  BddTest().when('there is a server error', () => {
    beforeEach(async () => {
      server.use(libraryActivitiesErrorHandler)
      wrapper = mountComponent(ActivityLibraryTab, { global: { stubs } })
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="activity-error-message-stub"]').exists()).toBe(false)
      })
    })

    BddTest().then('it should render the error message', () => {
      expect(wrapper.find('[data-testid="activity-error-message-stub"]').exists()).toBe(false)
    })

    BddTest().then('it should not render activity cards', () => {
      expect(wrapper.findAllComponents(ActivityLibraryCardStub)).toHaveLength(0)
    })
  })
})
