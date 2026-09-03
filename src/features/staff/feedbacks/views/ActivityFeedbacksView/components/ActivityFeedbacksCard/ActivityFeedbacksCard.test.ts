import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContentWithEnrolledStudent1 } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { getMockedFeedbackDashboard } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { EFeedbackStatus } from '@/api/avenir-esr'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { ICONS } from '@/common/constants'
import { FeedbackStatusPickerStub } from '@/features/staff/feedbacks/components/interaction/pickers/FeedbackStatusPicker/FeedbackStatusPicker.stub'
import ActivityFeedbacksCard from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/ActivityFeedbacksCard/ActivityFeedbacksCard.vue'
import { FeedbacksTableStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an ActivityFeedbacksCard component', () => {
  const dashboard = getMockedFeedbackDashboard({ activityId: mockedActivityContentWithEnrolledStudent1.id })
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbacksCard>>

  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub,
    FeedbackStatusPicker: FeedbackStatusPickerStub,
    FeedbacksTable: FeedbacksTableStub,
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = mountComponent(ActivityFeedbacksCard, {
      props: { activity: mockedActivityContentWithEnrolledStudent1 },
      global: { stubs },
    })
    await flushPromises()
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

    BddTest().then('it should render FeedbackStatusPicker', () => {
      expect(wrapper.findComponent(FeedbackStatusPickerStub).exists()).toBe(true)
    })

    BddTest().then('it should pass totalFeedbacks to FeedbackStatusPicker', () => {
      expect(wrapper.findComponent(FeedbackStatusPickerStub).props('totalFeedbacks')).toBe(dashboard.totalFeedbacks)
    })

    BddTest().then('it should pass newFeedbacks to FeedbackStatusPicker', () => {
      expect(wrapper.findComponent(FeedbackStatusPickerStub).props('newFeedbacks')).toBe(dashboard.newFeedbacks)
    })

    BddTest().then('it should pass sentFeedbacks to FeedbackStatusPicker', () => {
      expect(wrapper.findComponent(FeedbackStatusPickerStub).props('sentFeedbacks')).toBe(dashboard.processedFeedbacks)
    })

    BddTest().then('it should pass unprocessedFeedbacks to FeedbackStatusPicker', () => {
      expect(wrapper.findComponent(FeedbackStatusPickerStub).props('unprocessedFeedbacks')).toBe(
        dashboard.pendingFeedbacks - dashboard.newFeedbacks
      )
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

    BddTest().then('it should initialize FeedbacksTable with ALL selectedStatus', () => {
      expect(wrapper.findComponent(FeedbacksTableStub).props('selectedStatus')).toBe('ALL')
    })
  })

  BddTest().when('FeedbackStatusPicker emits a select event', () => {
    beforeEach(async () => {
      wrapper.findComponent(FeedbackStatusPickerStub).vm.$emit('select', { value: EFeedbackStatus.NEW, label: 'New' })
      await flushPromises()
    })

    BddTest().then('it should update selectedStatus passed to FeedbacksTable', () => {
      expect(wrapper.findComponent(FeedbacksTableStub).props('selectedStatus')).toBe(EFeedbackStatus.NEW)
    })
  })
})
