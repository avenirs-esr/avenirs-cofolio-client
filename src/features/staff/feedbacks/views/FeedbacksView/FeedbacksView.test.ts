import type { BreadcrumbLinkRaw } from '@/common/types'
import { getMockedActivitiesWithFeedbacks } from '@/__mocks__/fixtures/staffs/activities-with-feedbacks.fixtures'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { FeedbackStatusPickerStub } from '@/features/staff/feedbacks/components/interaction/pickers/FeedbackStatusPicker/FeedbackStatusPicker.stub'
import { FeedbackActivityConsignCardStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbackActivityConsignCard/FeedbackActivityConsignCard.stub'
import { FeedbacksDashboardCardsStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbacksDashboardCards/FeedbacksDashboardCards.stub'
import { FeedbacksFiltersCardStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbacksFiltersCard/FeedbacksFiltersCard.stub'
import { FeedbacksTableStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.stub'
import FeedbacksView, { type FeedbacksViewProps } from '@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const route = reactive<{ name: string, fullPath: string, query: Record<string, unknown>, matched: unknown[], meta: { breadcrumb: BreadcrumbLinkRaw[] } }>({
  name: '',
  fullPath: '',
  query: {},
  matched: [],
  meta: {
    breadcrumb: [
      META_BREADCRUMBS.STAFF.HOME,
      META_BREADCRUMBS.STAFF.STUDENT_TRACKING.DEFAULT,
      { textKey: META_BREADCRUMBS.STAFF.STUDENT_TRACKING.FEEDBACKS.textKey },
    ]
  }
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => route,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
    }),
  }
})

BddTest().given('a feedbacks view', () => {
  const activity = getMockedActivitiesWithFeedbacks()[0]

  let wrapper: VueWrapper<InstanceType<typeof FeedbacksView>>

  const stubs = {
    PageTitle: PageTitleStub,
    FeedbackStatusPicker: FeedbackStatusPickerStub,
    FeedbacksTable: FeedbacksTableStub,
    FeedbacksFiltersCard: FeedbacksFiltersCardStub,
    FeedbacksDashboardCards: FeedbacksDashboardCardsStub,
    FeedbackActivityConsignCard: FeedbackActivityConsignCardStub,
  }

  const mountWith = async (props: Partial<FeedbacksViewProps> = {}) => {
    vi.clearAllMocks()
    vi.clearAllMocks()

    wrapper = mountComponent(FeedbacksView, {
      props,
      global: { stubs }
    })
    await flushPromises()
  }

  BddTest().when('the view is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

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
      expect(dashboardCard.props('title')).toBeUndefined()
    })

    BddTest().then('it should render FeedbackActivityConsignCard with no activity selected', () => {
      const activityConsignCard = wrapper.findComponent(FeedbackActivityConsignCardStub)
      expect(activityConsignCard.exists()).toBe(true)
      expect(activityConsignCard.props('description')).toBeUndefined()
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

  BddTest().when('an activityId is provided', () => {
    beforeEach(async () => {
      await mountWith({ activityId: activity.id })
    })

    BddTest().then('it should forward activityId to FeedbacksFiltersCard', () => {
      expect(wrapper.findComponent(FeedbacksFiltersCardStub).props('defaultActivityId')).toBe(activity.id)
    })
  })

  BddTest().when('FeedbacksFiltersCard emits selectedActivityChange with an activity', () => {
    beforeEach(async () => {
      await mountWith()
      wrapper.findComponent(FeedbacksFiltersCardStub).vm.$emit('selectedActivityChange', activity)
      await flushPromises()
    })

    BddTest().then('it should forward the activity title to FeedbacksDashboardCard', () => {
      expect(wrapper.findComponent(FeedbacksDashboardCardsStub).props('title')).toEqual(activity.title)
    })

    BddTest().then('it should forward the activity description to FeedbackActivityConsignCard', () => {
      expect(wrapper.findComponent(FeedbackActivityConsignCardStub).props('description')).toEqual(activity.description)
    })

    BddTest().then('it should update the selectedActivityIdRef used by FeedbacksTable', () => {
      expect(wrapper.findComponent(FeedbacksTableStub).props('usePaginatedStaffFeedbacksParams').selectedActivityIdRef?.value).toBe(activity.id)
    })
  })

  BddTest().when('FeedbacksFiltersCard emits selectedActivityChange with undefined after an activity was selected', () => {
    beforeEach(async () => {
      await mountWith()
      wrapper.findComponent(FeedbacksFiltersCardStub).vm.$emit('selectedActivityChange', activity)
      await flushPromises()
      wrapper.findComponent(FeedbacksFiltersCardStub).vm.$emit('selectedActivityChange', undefined)
      await flushPromises()
    })

    BddTest().then('it should clear the title on FeedbacksDashboardCard', () => {
      expect(wrapper.findComponent(FeedbacksDashboardCardsStub).props('title')).toBeUndefined()
    })

    BddTest().then('it should clear the description on FeedbackActivityConsignCard', () => {
      expect(wrapper.findComponent(FeedbackActivityConsignCardStub).props('description')).toBeUndefined()
    })

    BddTest().then('it should clear the selectedActivityIdRef used by FeedbacksTable', () => {
      expect(wrapper.findComponent(FeedbacksTableStub).props('usePaginatedStaffFeedbacksParams').selectedActivityIdRef?.value).toBeUndefined()
    })
  })
})
