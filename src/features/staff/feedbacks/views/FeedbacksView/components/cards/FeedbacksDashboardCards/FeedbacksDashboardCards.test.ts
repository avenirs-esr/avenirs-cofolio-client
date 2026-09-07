import type { ActivityItemNavigationDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import FeedbacksDashboardCards, { type FeedbacksFiltersCardsProps } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbacksDashboardCards/FeedbacksDashboardCards.vue'
import { DashboardCardStub } from '@/features/staff/global/components/cards/DashboardCard/DashboardCard.stub'
import { MDI_ICONS, MS_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a feedbacks dashboard card', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbacksDashboardCards>>

  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub,
    DashboardCard: DashboardCardStub,
  }

  const mountWith = (props: Partial<FeedbacksFiltersCardsProps> = {}) => {
    wrapper = mountComponent(FeedbacksDashboardCards, {
      props: {
        totalFeedbacks: 9,
        newFeedbacks: 3,
        unprocessedFeedbacks: 5,
        sentFeedbacks: 2,
        ...props
      },
      global: { stubs }
    })
  }

  BddTest().when('no activity is selected', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the feedbacks dashboard cards component', () => {
      expect(wrapper.find('[data-testid="feedbacks-dashboard-cards"]').exists()).toBe(true)
    })

    BddTest().then('it should render the container title with "Toutes les demandes de feedback" and the dashboard icon', () => {
      const container = wrapper.findComponent(IconTitleCardContainerStub)
      expect(container.props('title')).toBe('Tableau de bord : Toutes les demandes de feedback')
      expect(container.props('titleIcon')).toBe(RI_ICONS.DASHBOARD_2_LINE)
    })

    BddTest().then('it should render the three dashboard cards with their testid, icon and value', () => {
      const cards = wrapper.findAllComponents(DashboardCardStub)
      expect(cards).toHaveLength(3)
      expect(cards[0].props('icon')).toBe(MDI_ICONS.CHAT_ALERT)
      expect(cards[0].props('value')).toBe('3')
      expect(cards[1].props('icon')).toBe(MS_ICONS.CHAT_OUTLINE_ROUNDED)
      expect(cards[1].props('value')).toBe('5')
      expect(cards[2].props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE)
      expect(cards[2].props('value')).toBe('2/9')
    })
  })

  BddTest().when('an activity is selected', () => {
    const activity: ActivityItemNavigationDTO = { id: 'activity-1', title: 'Bilan de compétences' }

    beforeEach(() => {
      mountWith({ activity })
    })

    BddTest().then('it should render the container title with the activity title', () => {
      const container = wrapper.findComponent(IconTitleCardContainerStub)
      expect(container.props('title')).toBe('Tableau de bord : Bilan de compétences')
    })
  })

  BddTest().when('newFeedbacks, unprocessedFeedbacks and sentFeedbacks are equal to 1', () => {
    beforeEach(() => {
      mountWith({
        newFeedbacks: 1,
        unprocessedFeedbacks: 1,
        sentFeedbacks: 1,
        totalFeedbacks: 1,
      })
    })

    BddTest().then('it should render the processed value as "1/1"', () => {
      expect(wrapper.findAllComponents(DashboardCardStub)[2].props('value')).toBe('1/1')
    })
  })
})
