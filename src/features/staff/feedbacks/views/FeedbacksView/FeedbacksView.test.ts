import type { ActivityItemNavigationDTO } from '@/api/avenir-esr'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { FeedbackStatusPickerStub } from '@/features/staff/feedbacks/components/interaction/pickers/FeedbackStatusPicker/FeedbackStatusPicker.stub'
import { FeedbacksDashboardCardsStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbacksDashboardCards/FeedbacksDashboardCards.stub'
import { FeedbacksFiltersCardStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbacksFilterdCard/FeedbacksFiltersCard.stub'
import { FeedbacksTableStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.stub'
import FeedbacksView from '@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const activity: ActivityItemNavigationDTO = { id: 'activity-1', title: 'Bilan de compétences' }

BddTest().given('a feedbacks view', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbacksView>>

  const stubs = {
    PageTitle: PageTitleStub,
    FeedbackStatusPicker: FeedbackStatusPickerStub,
    FeedbacksTable: FeedbacksTableStub,
    FeedbacksFiltersCard: FeedbacksFiltersCardStub,
    FeedbacksDashboardCards: FeedbacksDashboardCardsStub,
  }

  beforeEach(async () => {
    wrapper = mountComponent(FeedbacksView, {
      global: {
        stubs,
      },
    })
    await flushPromises()
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Toutes mes demandes de feedback')

      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Suivi des apprenants' },
        { text: 'Toutes mes demandes de feedback' },
      ])
    })

    BddTest().then('it should render FeedbacksFiltersCard', () => {
      expect(wrapper.findComponent(FeedbacksFiltersCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render FeedbacksDashboardCards with no activity selected', () => {
      const dashboardCard = wrapper.findComponent(FeedbacksDashboardCardsStub)
      expect(dashboardCard.exists()).toBe(true)
      expect(dashboardCard.props('activity')).toBeUndefined()
    })

    BddTest().then('it should render FeedbackStatusPicker', () => {
      expect(wrapper.findComponent(FeedbackStatusPickerStub).exists()).toBe(true)
    })

    BddTest().then('it should forward the same feedback counts to FeedbacksDashboardCards and FeedbackStatusPicker', () => {
      const dashboardCard = wrapper.findComponent(FeedbacksDashboardCardsStub)
      const statusPicker = wrapper.findComponent(FeedbackStatusPickerStub)

      expect(dashboardCard.props('totalFeedbacks')).toBe(statusPicker.props('totalFeedbacks'))
      expect(dashboardCard.props('newFeedbacks')).toBe(statusPicker.props('newFeedbacks'))
      expect(dashboardCard.props('unprocessedFeedbacks')).toBe(statusPicker.props('unprocessedFeedbacks'))
      expect(dashboardCard.props('sentFeedbacks')).toBe(statusPicker.props('sentFeedbacks'))
    })

    BddTest().then('it should render FeedbacksTable with no activity selected', () => {
      const table = wrapper.findComponent(FeedbacksTableStub)
      expect(table.exists()).toBe(true)
      expect(table.props('usePaginatedStaffFeedbacksParams').selectedActivityIdRef?.value).toBeUndefined()
    })
  })

  BddTest().when('FeedbacksFiltersCard emits selectedActivityChange with an activity', () => {
    beforeEach(async () => {
      wrapper.findComponent(FeedbacksFiltersCardStub).vm.$emit('selectedActivityChange', activity)
      await flushPromises()
    })

    BddTest().then('it should forward the activity to FeedbacksDashboardCard', () => {
      expect(wrapper.findComponent(FeedbacksDashboardCardsStub).props('activity')).toEqual(activity)
    })

    BddTest().then('it should update the selectedActivityIdRef used by FeedbacksTable', () => {
      const table = wrapper.findComponent(FeedbacksTableStub)
      expect(table.props('usePaginatedStaffFeedbacksParams').selectedActivityIdRef?.value).toBe(activity.id)
    })
  })

  BddTest().when('FeedbacksFiltersCard emits selectedActivityChange with undefined after an activity was selected', () => {
    beforeEach(async () => {
      wrapper.findComponent(FeedbacksFiltersCardStub).vm.$emit('selectedActivityChange', activity)
      await flushPromises()
      wrapper.findComponent(FeedbacksFiltersCardStub).vm.$emit('selectedActivityChange', undefined)
      await flushPromises()
    })

    BddTest().then('it should clear the activity on FeedbacksDashboardCard', () => {
      expect(wrapper.findComponent(FeedbacksDashboardCardsStub).props('activity')).toBeUndefined()
    })

    BddTest().then('it should clear the selectedActivityIdRef used by FeedbacksTable', () => {
      const table = wrapper.findComponent(FeedbacksTableStub)
      expect(table.props('usePaginatedStaffFeedbacksParams').selectedActivityIdRef?.value).toBeUndefined()
    })
  })
})
