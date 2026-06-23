import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ICONS } from '@/common/constants'
import ActivityFeedbacksCard from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/ActivityFeedbacksCard/ActivityFeedbacksCard.vue'
import { FeedbacksTableStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.stub'
import { IconTitleCardContainerStub } from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an ActivityFeedbacksCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbacksCard>>

  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub,
    FeedbacksTable: FeedbacksTableStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(ActivityFeedbacksCard, {
      props: { activity: mockedActivityContent },
      global: { stubs },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render IconTitleCardContainer', () => {
      expect(wrapper.findComponent(IconTitleCardContainerStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the correct title to IconTitleCardContainer', () => {
      expect(wrapper.findComponent(IconTitleCardContainerStub).props('title')).toBe('Demande de feedback')
    })

    BddTest().then('it should pass the feedback icon to IconTitleCardContainer', () => {
      expect(wrapper.findComponent(IconTitleCardContainerStub).props('titleIcon')).toBe(ICONS.FEEDBACK)
    })

    BddTest().then('it should render FeedbacksTable', () => {
      expect(wrapper.findComponent(FeedbacksTableStub).exists()).toBe(true)
    })

    BddTest().then('it should pass withActivity=false to FeedbacksTable', () => {
      expect(wrapper.findComponent(FeedbacksTableStub).props('withActivity')).toBe(false)
    })

    BddTest().then('it should pass usePaginatedStaffFeedbacksParams to FeedbacksTable', () => {
      expect(wrapper.findComponent(FeedbacksTableStub).props('usePaginatedStaffFeedbacksParams')).toBeDefined()
    })
  })
})
