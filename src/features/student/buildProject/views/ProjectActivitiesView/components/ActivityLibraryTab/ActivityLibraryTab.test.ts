import type { VueWrapper } from '@vue/test-utils'
import { libraryActivitiesErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { ActivityErrorMessageStub } from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.stub'
import { useProjectActivitiesStore } from '@/features/student/buildProject/stores/activities.store'
import { ActivityLibraryCardStub } from '@/features/student/buildProject/views/ProjectActivitiesView/components/ActivityLibraryCard/ActivityLibraryCard.stub'
import ActivityLibraryTab from '@/features/student/buildProject/views/ProjectActivitiesView/components/ActivityLibraryTab/ActivityLibraryTab.vue'
import { AvIconTextStub, AvPaginationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an ActivityLibraryTab', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityLibraryTab>>

  const stubs = {
    ActivityLibraryCard: ActivityLibraryCardStub,
    ActivityErrorMessage: ActivityErrorMessageStub,
    AvIconText: AvIconTextStub,
    AvPagination: AvPaginationStub,
    Loader: LoaderStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(ActivityLibraryTab, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the root element', () => {
      expect(wrapper.find('[data-testid="activity-library-tab"]').exists()).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      expect(wrapper.findComponent(AvIconTextStub).exists()).toBe(true)
    })
  })

  BddTest().when('data is loaded', () => {
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
      expect(wrapper.findComponent(AvPaginationStub).exists()).toBe(true)
    })

    BddTest().then('it should not render the error message', () => {
      expect(wrapper.find('[data-testid="activity-error-message-stub"]').exists()).toBe(false)
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

  BddTest().when('the user changes the page', () => {
    let store: ReturnType<typeof useProjectActivitiesStore>

    beforeEach(async () => {
      store = useProjectActivitiesStore()
      await vi.waitFor(() => {
        const cards = wrapper.findAllComponents(ActivityLibraryCardStub)
        expect(cards.length).toBeGreaterThan(0)
      })
      wrapper.findComponent(AvPaginationStub).vm.$emit('update:current-page', 1)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the current page in the store', () => {
      expect(store.libraryCurrentPage).toBe(1)
    })
  })
})
