import type { VueWrapper } from '@vue/test-utils'
import { activitiesViewErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { ActivityCardStub } from '@/features/buildProject/components/cards/ActivityCard/ActivityCard.stub'
import AllActivitiesSection from '@/features/buildProject/views/ProjectActivitiesView/components/AllActivitiesSection/AllActivitiesSection.vue'
import { AvIconTextStub, AvTagPickerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an all activities section', () => {
  let wrapper: VueWrapper<InstanceType<typeof AllActivitiesSection>>

  const stubs = {
    AvIconText: AvIconTextStub,
    Pagination: PaginationStub,
    ActivityCard: ActivityCardStub,
    AvTagPicker: AvTagPickerStub,
    Loader: LoaderStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(AllActivitiesSection, { global: { stubs } })
  })

  BddTest().when('the component is mounted without error', () => {
    beforeEach(async () => {
      await vi.waitFor(() => {
        const cards = wrapper.findAllComponents(ActivityCardStub)
        expect(cards.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toContain('Toutes les activités')
    })

    BddTest().then('it should render filter tags', () => {
      const filters = wrapper.findComponent(AvTagPickerStub)
      expect(filters.exists()).toBe(true)
    })

    BddTest().then('it should render the pagination', () => {
      expect(wrapper.findComponent(PaginationStub).exists()).toBe(true)
    })

    BddTest().then('it should render the activity cards', () => {
      const cards = wrapper.findAllComponents(ActivityCardStub)
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  BddTest().when('the component is mounted with an error', () => {
    beforeEach(async () => {
      server.use(activitiesViewErrorHandler)
      vi.clearAllMocks()
      wrapper = mountComponent(AllActivitiesSection, { global: { stubs } })

      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="activity-error-message-stub"]').exists()).toBe(false)
      })
    })

    BddTest().then('it should render the error message', () => {
      expect(wrapper.find('[data-testid="activity-error-message-stub"]').exists()).toBe(false)
    })

    BddTest().then('it should not render activity cards', () => {
      expect(wrapper.findAllComponents(ActivityCardStub)).toHaveLength(0)
    })
  })
})
