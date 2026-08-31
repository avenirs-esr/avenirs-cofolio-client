import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ActivityDescriptionContentStub } from '@/features/activities/components/raw/ActivityDescriptionContent/ActivityDescriptionContent.stub'
import { ActivityPeriodDisplayStub } from '@/features/activities/components/interactions/inputs/ActivityPeriodDisplay/ActivityPeriodDisplay.stub'
import { ActivityRecommendedCompletionContextsListStub } from '@/features/activities/components/lists/ActivityRecommendedCompletionContextsList/ActivityRecommendedCompletionContextsList.stub'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { ActivityResourcesListStub } from '@/features/activities/components/lists/ActivityResourcesList/ActivityResourcesList.stub'
import { ICONS } from '@/common/constants'
import { FeedbackInfoCardStub } from '@/features/buildProject/views/ProjectActivityDetailedView/components/cards/FeedbackInfoCard/FeedbackInfoCard.stub'
import { TraceAssociationLimitCardStub } from '@/features/buildProject/views/ProjectActivityDetailedView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.stub'
import ProjectActivityDetails, {
  type ProjectActivityDetailsProps,
} from '@/features/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetails/ProjectActivityDetails.vue'
import {
  AvIconTextStub,
  BddTest,
} from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a project activity details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivityDetails>>

  const stubs = {
    ActivityDescriptionContent: ActivityDescriptionContentStub,
    ActivityPeriodDisplay: ActivityPeriodDisplayStub,
    ActivityRecommendedCompletionContextsList: ActivityRecommendedCompletionContextsListStub,
    Card: CardStub,
    AvIconText: AvIconTextStub,
    FeedbackInfoCard: FeedbackInfoCardStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    TraceAssociationLimitCard: TraceAssociationLimitCardStub,
    ActivityResourcesList: ActivityResourcesListStub,
    ValorizedBadge: ValorizedBadgeStub,
  }

  BddTest().when('the component is mounted with recommendedCompletionContexts containing "-" lines and startDate and endDate', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: mockedDeclaredActivityDetails,
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the main container', () => {
      const container = wrapper.find('[data-testid="project-activity-details"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render ActivityPeriodDisplay with the correct dates', () => {
      const periodDisplay = wrapper.findComponent(ActivityPeriodDisplayStub)
      expect(periodDisplay.exists()).toBe(true)
      expect(periodDisplay.props('startDate')).toBe(mockedDeclaredActivityDetails.startDate)
      expect(periodDisplay.props('endDate')).toBe(mockedDeclaredActivityDetails.endDate)
    })

    BddTest().then('it should render the activity title in AvIconText', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe(mockedDeclaredActivityDetails.activity.title)
    })

    BddTest().then('it should render the activity description', () => {
      const description = wrapper.findComponent(ActivityDescriptionContentStub)
      expect(description.exists()).toBe(true)
      expect(description.props('description')).toBe(mockedDeclaredActivityDetails.activity.description)
    })

    BddTest().then('it should render the recommended completion contexts list', () => {
      const list = wrapper.findComponent(ActivityRecommendedCompletionContextsListStub)
      expect(list.exists()).toBe(true)
      expect(list.props('recommendedCompletionContexts')).toBe(mockedDeclaredActivityDetails.activity.recommendedCompletionContexts)
    })

    BddTest().then('it should render the feedback info card with additional info disabled', () => {
      const feedbackInfoCard = wrapper.findComponent(FeedbackInfoCardStub)
      expect(feedbackInfoCard.exists()).toBe(true)
      expect(feedbackInfoCard.props('activity')).toEqual(mockedDeclaredActivityDetails)
      expect(feedbackInfoCard.props('showAdditionalInfo')).toBe(false)
    })

    BddTest().then('it should render the trace association limit card with the expected props', () => {
      const traceAssociationLimitCard = wrapper.findComponent(TraceAssociationLimitCardStub)
      expect(traceAssociationLimitCard.exists()).toBe(true)
      expect(traceAssociationLimitCard.props('traceAllowedAssociations')).toBe(mockedDeclaredActivityDetails.activity.traceAllowedAssociations)
      expect(traceAssociationLimitCard.props('icon')).toBe(ICONS.TRACES)
      expect(traceAssociationLimitCard.props('title')).toBe('Association de traces')
    })
  })

  BddTest().when('the activity has a staff-defined period, taking priority over the student period', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        startDate: '2024-05-01',
        endDate: '2024-05-15',
        activity: {
          ...mockedDeclaredActivityDetails.activity,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render ActivityPeriodDisplay with the staff-defined dates', () => {
      const periodDisplay = wrapper.findComponent(ActivityPeriodDisplayStub)
      expect(periodDisplay.props('startDate')).toBe('2024-01-01')
      expect(periodDisplay.props('endDate')).toBe('2024-12-31')
    })
  })

  BddTest().when('the component is mounted with empty recommendedCompletionContexts', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: {
          ...mockedDeclaredActivityDetails.activity,
          recommendedCompletionContexts: '',
        },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the recommended completion contexts list with an empty string', () => {
      const list = wrapper.findComponent(ActivityRecommendedCompletionContextsListStub)
      expect(list.exists()).toBe(true)
      expect(list.props('recommendedCompletionContexts')).toBe('')
    })
  })

  BddTest().when('the activity is valorized', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        valorized: true,
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render ValorizedBadge with valorized true', () => {
      const badge = wrapper.findComponent(ValorizedBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(true)
    })
  })

  BddTest().when('the activity is not valorized', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        valorized: false,
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render ValorizedBadge with valorized false', () => {
      const badge = wrapper.findComponent(ValorizedBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('valorized')).toBe(false)
    })
  })

  BddTest().when('the component is mounted without startDate and endDate', () => {
    const props: ProjectActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        startDate: undefined,
        endDate: undefined,
        activity: {
          ...mockedDeclaredActivityDetails.activity,
          startDate: undefined,
          endDate: undefined,
        },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ProjectActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should not render ActivityPeriodDisplay', () => {
      const periodDisplay = wrapper.findComponent(ActivityPeriodDisplayStub)
      expect(periodDisplay.exists()).toBe(false)
    })
  })
})
