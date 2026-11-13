import type { ReceivedAssessmentDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import type { ActivityDetailsProps } from '@/features/student/activities/views/ActivityView/components/ActivityDetails/ActivityDetails.vue'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { CardStub, ICONS } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect } from 'vitest'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ActivityDescriptionContentStub } from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.stub'
import { ActivityPeriodDisplayStub } from '@/common/activities/components/ActivityPeriodDisplay/ActivityPeriodDisplay.stub'
import { ActivityRecommendedCompletionContextsListStub } from '@/common/activities/components/ActivityRecommendedCompletionContextsList/ActivityRecommendedCompletionContextsList.stub'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { ActivityResourcesListStub } from '@/common/components/interaction/lists/ActivityResourcesList/ActivityResourcesList.stub'
import ActivityDetails from '@/features/student/activities/views/ActivityView/components/ActivityDetails/ActivityDetails.vue'
import { AssessmentInfoCardStub } from '@/features/student/activities/views/ActivityView/components/cards/AssessmentInfoCard/AssessmentInfoCard.stub'
import { FeedbackInfoCardStub } from '@/features/student/activities/views/ActivityView/components/cards/FeedbackInfoCard/FeedbackInfoCard.stub'
import { TraceAssociationLimitCardStub } from '@/features/student/activities/views/ActivityView/components/cards/TraceAssociationLimitCard/TraceAssociationLimitCard.stub'
import { ReceivedAssessmentSectionStub } from '@/features/student/activities/views/ActivityView/components/sections/ReceivedAssessmentSection/ReceivedAssessmentSection.stub'

const receivedAssessment: ReceivedAssessmentDTO = {
  grade: 16,
  maxGrade: 20,
  sentAt: '2025-05-25T10:00:00.000Z',
  assessedBy: { id: 'staff-1', email: 'perceval@test.fr', firstName: 'Marc', lastName: 'Perceval' },
}

BddTest().given('a project activity details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDetails>>

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
    AssessmentInfoCard: AssessmentInfoCardStub,
    ValorizedBadge: ValorizedBadgeStub,
    ReceivedAssessmentSection: ReceivedAssessmentSectionStub,
  }

  BddTest().when('the component is mounted with recommendedCompletionContexts containing "-" lines and startDate and endDate', () => {
    const props: ActivityDetailsProps = {
      declaredActivityDetails: mockedDeclaredActivityDetails,
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the main container', () => {
      const container = wrapper.find('[data-testid="activity-details"]')
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

    BddTest().then('it should render the assessment info card without assessment', () => {
      const assessmentInfoCard = wrapper.findComponent(AssessmentInfoCardStub)
      expect(assessmentInfoCard.exists()).toBe(true)
      expect(assessmentInfoCard.props('assessment')).toBeUndefined()
    })

    BddTest().then('it should not render ReceivedAssessmentSection', () => {
      expect(wrapper.findComponent(ReceivedAssessmentSectionStub).exists()).toBe(false)
    })
  })

  BddTest().when('the activity has a staff-defined period, taking priority over the student period', () => {
    const props: ActivityDetailsProps = {
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
      wrapper = mountComponent(ActivityDetails, {
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
    const props: ActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: {
          ...mockedDeclaredActivityDetails.activity,
          recommendedCompletionContexts: '',
        },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityDetails, {
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
    const props: ActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        valorized: true,
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityDetails, {
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
    const props: ActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        valorized: false,
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityDetails, {
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
    const props: ActivityDetailsProps = {
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
      wrapper = mountComponent(ActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should not render ActivityPeriodDisplay', () => {
      const periodDisplay = wrapper.findComponent(ActivityPeriodDisplayStub)
      expect(periodDisplay.exists()).toBe(false)
    })
  })

  BddTest().when('the activity expects an assessment that has been sent', () => {
    const props: ActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: { ...mockedDeclaredActivityDetails.activity, assessment: { grade: 20 } },
        assessment: receivedAssessment,
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the assessment info card with the activity assessment settings', () => {
      expect(wrapper.findComponent(AssessmentInfoCardStub).props('assessment')).toEqual({ grade: 20 })
    })

    BddTest().then('it should render ReceivedAssessmentSection with the received assessment', () => {
      const section = wrapper.findComponent(ReceivedAssessmentSectionStub)

      expect(section.exists()).toBe(true)
      expect(section.props('assessment')).toEqual(receivedAssessment)
    })
  })

  BddTest().when('the activity expects an assessment that has not been requested yet', () => {
    const props: ActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: { ...mockedDeclaredActivityDetails.activity, assessment: { grade: 20 } },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render ReceivedAssessmentSection without assessment', () => {
      const section = wrapper.findComponent(ReceivedAssessmentSectionStub)

      expect(section.exists()).toBe(true)
      expect(section.props('assessment')).toBeUndefined()
    })
  })

  BddTest().when('the activity is a sub-activity without staff-defined period', () => {
    const props: ActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        valorized: true,
        startDate: '2024-05-01',
        endDate: '2024-05-15',
        activity: {
          ...mockedDeclaredActivityDetails.activity,
          mainActivityId: 'main-activity-id',
          startDate: undefined,
          endDate: undefined,
          assessment: { grade: 20 },
        },
        assessment: receivedAssessment,
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the sub-activity title, description and recommended completion contexts', () => {
      const titles = wrapper.findAllComponents(AvIconTextStub)

      expect(titles).toHaveLength(1)
      expect(titles[0]!.props('text')).toBe(props.declaredActivityDetails.activity.title)
      expect(wrapper.findComponent(ActivityDescriptionContentStub).props('description')).toBe(props.declaredActivityDetails.activity.description)
      expect(wrapper.findComponent(ActivityRecommendedCompletionContextsListStub).props('recommendedCompletionContexts'))
        .toBe(props.declaredActivityDetails.activity.recommendedCompletionContexts)
    })

    BddTest().then('it should not render the student period of the main activity', () => {
      expect(wrapper.findComponent(ActivityPeriodDisplayStub).exists()).toBe(false)
    })

    BddTest().then('it should not render ValorizedBadge', () => {
      expect(wrapper.findComponent(ValorizedBadgeStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the activity modalities', () => {
      expect(wrapper.find('[data-testid="activity-modalities"]').exists()).toBe(false)
      expect(wrapper.findComponent(FeedbackInfoCardStub).exists()).toBe(false)
      expect(wrapper.findComponent(TraceAssociationLimitCardStub).exists()).toBe(false)
      expect(wrapper.findComponent(AssessmentInfoCardStub).exists()).toBe(false)
    })

    BddTest().then('it should not render ReceivedAssessmentSection', () => {
      expect(wrapper.findComponent(ReceivedAssessmentSectionStub).exists()).toBe(false)
    })
  })

  BddTest().when('the activity is a sub-activity with a staff-defined period', () => {
    const props: ActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: {
          ...mockedDeclaredActivityDetails.activity,
          mainActivityId: 'main-activity-id',
          startDate: '2024-02-01',
          endDate: '2024-03-15',
        },
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render ActivityPeriodDisplay with the sub-activity dates', () => {
      const periodDisplay = wrapper.findComponent(ActivityPeriodDisplayStub)

      expect(periodDisplay.exists()).toBe(true)
      expect(periodDisplay.props('startDate')).toBe('2024-02-01')
      expect(periodDisplay.props('endDate')).toBe('2024-03-15')
    })
  })

  BddTest().when('the activity does not expect an assessment', () => {
    const props: ActivityDetailsProps = {
      declaredActivityDetails: {
        ...mockedDeclaredActivityDetails,
        activity: { ...mockedDeclaredActivityDetails.activity, assessment: undefined },
        assessment: receivedAssessment,
      },
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityDetails, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should not render ReceivedAssessmentSection', () => {
      expect(wrapper.findComponent(ReceivedAssessmentSectionStub).exists()).toBe(false)
    })
  })
})
