import type { ActivityAssessmentDTO, ActivityContentDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import type { NationalActivitySettingDetailsProps } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySettingDetails/NationalActivitySettingDetails.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ICONS } from '@avenirs-esr/shared'
import { interpolateTranslation } from '@avenirs-esr/shared/test-utils/unit'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockedActivityContent, mockedSubActivityContent, mockedSubActivityContentWithPeriod } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { EnabledDisabledStatusBadgeStub } from '@/common/components/badges/EnabledDisabledStatusBadge/EnabledDisabledStatusBadge.stub'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY, ACTIVITY_TRACE_SETTING_DISABLED_VALUE, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { NationalActivityExecutionPeriodDetailsStub } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityExecutionPeriodDetails/NationalActivityExecutionPeriodDetails.stub'
import NationalActivitySettingDetails from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySettingDetails/NationalActivitySettingDetails.vue'

const ASSESSMENT_COMMENT_LABEL = 'Appréciation qualitative'
const ASSESSMENT_GRADE_LABEL = 'Note sur {maxGrade}'
const ASSESSMENT_TITLE = 'Évaluation de l\'activité'
const ASSESSMENT_VALIDATION_LABEL = 'Validation'
const FEEDBACK_ITERATIONS_LABEL = '{count} itérations'
const FEEDBACK_TITLE = 'Demande de feedback'
const REFLECTION_TITLE = 'Prise de recul'
const SETTING_DETAILS_TITLE = 'Paramètres et diffusion'
const TRACE_ASSOCIATIONS_LABEL = '{count} traces'
const TRACE_TITLE = 'Association de traces'
const UNLIMITED_ITERATIONS_LABEL = 'Itérations illimitées'
const UNLIMITED_TRACES_LABEL = 'Traces illimitées'

const SETTING_DETAILS_TEST_ID = 'national-activity-setting-details'
const REFLECTION_TEST_ID = 'national-activity-setting-details-reflection'
const TRACE_TEST_ID = 'national-activity-setting-details-trace'
const FEEDBACK_TEST_ID = 'national-activity-setting-details-feedback'
const ASSESSMENT_TEST_ID = 'national-activity-setting-details-assessment'
const ASSESSMENT_COMMENT_BADGE_TEST_ID = 'assessment-comment-badge'
const ASSESSMENT_GRADE_BADGE_TEST_ID = 'assessment-grade-badge'
const ASSESSMENT_VALIDATION_BADGE_TEST_ID = 'assessment-validation-badge'

const NEUTRAL_BADGE_COLOR = 'var(--light-foreground-neutral)'
const NEUTRAL_BADGE_BACKGROUND_COLOR = 'var(--light-background-neutral)'

const defaultProps: NationalActivitySettingDetailsProps = {
  activity: mockedActivityContent,
}

BddTest().given('a national activity setting details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivitySettingDetails>>

  const stubs = {
    AvBadge: AvBadgeStub,
    EnabledDisabledStatusBadge: EnabledDisabledStatusBadgeStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    NationalActivityExecutionPeriodDetails: NationalActivityExecutionPeriodDetailsStub,
  }

  const mountWith = (props: Partial<NationalActivitySettingDetailsProps> = {}) => {
    wrapper = mount(NationalActivitySettingDetails, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: { stubs },
    })
  }

  const getExecutionPeriodDetails = () => wrapper.findComponent(NationalActivityExecutionPeriodDetailsStub)

  const findByTestId = (testid: string) => wrapper.find(`[data-testid="${testid}"]`)
  const findCardIn = (testid: string) => findByTestId(testid).findComponent(IconTitleCardContainerStub)
  const findEnabledDisabledStatusBadgeIn = (testid: string) => findByTestId(testid).findComponent(EnabledDisabledStatusBadgeStub)
  const findBadgeIn = (testid: string) => findByTestId(testid).findComponent(AvBadgeStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the modalities container with proper title and icon', () => {
      const container = findCardIn(SETTING_DETAILS_TEST_ID)
      expect(container.exists()).toBe(true)
      expect(container.props('title')).toBe(SETTING_DETAILS_TITLE)
      expect(container.props('titleIcon')).toBe(MDI_ICONS.ALERT_CIRCLE_OUTLINE)
    })

    BddTest().then('it should render the reflection card with proper title and icon', () => {
      const card = findCardIn(REFLECTION_TEST_ID)
      expect(card.exists()).toBe(true)
      expect(card.props('title')).toBe(REFLECTION_TITLE)
      expect(card.props('titleIcon')).toBe(MDI_ICONS.TEXT_BOX_EDIT_OUTLINE)
    })

    BddTest().then('it should render the trace card with proper title and icon', () => {
      const card = findCardIn(TRACE_TEST_ID)
      expect(card.exists()).toBe(true)
      expect(card.props('title')).toBe(TRACE_TITLE)
      expect(card.props('titleIcon')).toBe(MDI_ICONS.ATTACH_FILE)
    })

    BddTest().then('it should render the feedback card with proper title and icon', () => {
      const card = findCardIn(FEEDBACK_TEST_ID)
      expect(card.exists()).toBe(true)
      expect(card.props('title')).toBe(FEEDBACK_TITLE)
      expect(card.props('titleIcon')).toBe(ICONS.FEEDBACK)
    })

    BddTest().then('it should render the assessment card with proper title and icon', () => {
      const card = findCardIn(ASSESSMENT_TEST_ID)
      expect(card.exists()).toBe(true)
      expect(card.props('title')).toBe(ASSESSMENT_TITLE)
      expect(card.props('titleIcon')).toBe(MDI_ICONS.TEXT_BOX_CHECK_OUTLINE)
    })
  })

  BddTest().when('the activity is a sub-activity', () => {
    beforeEach(() => {
      mountWith({
        activity: mockedSubActivityContent,
      })
    })

    BddTest().then('it should render the trace card', () => {
      expect(findByTestId(TRACE_TEST_ID).exists()).toBe(true)
    })

    BddTest().then('it should not render the reflection card', () => {
      expect(findByTestId(REFLECTION_TEST_ID).exists()).toBe(false)
    })

    BddTest().then('it should not render the feedback card', () => {
      expect(findByTestId(FEEDBACK_TEST_ID).exists()).toBe(false)
    })

    BddTest().then('it should not render the assessment card', () => {
      expect(findByTestId(ASSESSMENT_TEST_ID).exists()).toBe(false)
    })
  })

  BddTest().when('the activity has an execution period', () => {
    const startDate: ActivityContentDTO['startDate'] = '2026-03-01'
    const endDate: ActivityContentDTO['startDate'] = '2026-03-31'

    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          startDate,
          endDate,
        },
      })
    })

    BddTest().then('it should render the execution period details with the period', () => {
      const executionPeriodDetails = getExecutionPeriodDetails()
      expect(executionPeriodDetails.exists()).toBe(true)
      expect(executionPeriodDetails.props('startDate')).toBe(startDate)
      expect(executionPeriodDetails.props('endDate')).toBe(endDate)
    })
  })

  BddTest().when('the sub-activity has an execution period', () => {
    beforeEach(() => {
      mountWith({
        activity: mockedSubActivityContentWithPeriod,
      })
    })

    BddTest().then('it should render the execution period details with the sub-activity period', () => {
      const executionPeriodDetails = getExecutionPeriodDetails()
      expect(executionPeriodDetails.exists()).toBe(true)
      expect(executionPeriodDetails.props('startDate')).toBe(mockedSubActivityContentWithPeriod.startDate)
      expect(executionPeriodDetails.props('endDate')).toBe(mockedSubActivityContentWithPeriod.endDate)
    })
  })

  BddTest().when('the activity has no execution period', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          startDate: undefined,
          endDate: undefined,
        },
      })
    })

    BddTest().then('it should not render the execution period details', () => {
      expect(getExecutionPeriodDetails().exists()).toBe(false)
    })
  })

  BddTest().when('the activity only has a start date', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          startDate: '2026-03-01',
          endDate: undefined,
        },
      })
    })

    BddTest().then('it should not render the execution period details', () => {
      expect(getExecutionPeriodDetails().exists()).toBe(false)
    })
  })

  BddTest().when('the activity only has an end date', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          startDate: undefined,
          endDate: '2026-03-31',
        },
      })
    })

    BddTest().then('it should not render the execution period details', () => {
      expect(getExecutionPeriodDetails().exists()).toBe(false)
    })
  })

  BddTest().when('the reflection is disabled', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          enableReflection: false,
        },
      })
    })

    BddTest().then('it should display a disabled enabled status badge for reflection', () => {
      const badge = findEnabledDisabledStatusBadgeIn(REFLECTION_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(false)
    })
  })

  BddTest().when('the reflection is enabled', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          enableReflection: true,
        },
      })
    })

    BddTest().then('it should display an enabled status badge for reflection', () => {
      const badge = findEnabledDisabledStatusBadgeIn(REFLECTION_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(true)
    })
  })

  BddTest().when('the trace association is disabled', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          traceAllowedAssociations: ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
        },
      })
    })

    BddTest().then('it should display a disabled enabled status badge for trace association', () => {
      const badge = findEnabledDisabledStatusBadgeIn(TRACE_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(false)
    })

    BddTest().then('it should not display a trace association badge', () => {
      expect(findBadgeIn(TRACE_TEST_ID).exists()).toBe(false)
    })
  })

  BddTest().when('the trace association is enabled', () => {
    const traceAllowedAssociations: ActivityContentDTO['traceAllowedAssociations'] = 5

    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          traceAllowedAssociations,
        },
      })
    })

    BddTest().then('it should display an enabled status badge for trace association', () => {
      const badge = findEnabledDisabledStatusBadgeIn(TRACE_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(true)
    })

    BddTest().then('it should display the trace association count badge', () => {
      const badge = findBadgeIn(TRACE_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(interpolateTranslation(TRACE_ASSOCIATIONS_LABEL, {
        count: String(traceAllowedAssociations),
      }))
      expect(badge.props('color')).toBe(NEUTRAL_BADGE_COLOR)
      expect(badge.props('backgroundColor')).toBe(NEUTRAL_BADGE_BACKGROUND_COLOR)
      expect(badge.props('icon')).toBe(MDI_ICONS.ATTACH_FILE)
    })
  })

  BddTest().when('the trace association is enabled with unlimited traces', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
        },
      })
    })

    BddTest().then('it should display the unlimited traces badge', () => {
      const badge = findBadgeIn(TRACE_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(UNLIMITED_TRACES_LABEL)
      expect(badge.props('color')).toBe(NEUTRAL_BADGE_COLOR)
      expect(badge.props('backgroundColor')).toBe(NEUTRAL_BADGE_BACKGROUND_COLOR)
      expect(badge.props('icon')).toBe(MDI_ICONS.ATTACH_FILE)
    })
  })

  BddTest().when('the feedback is disabled', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          feedbackAllowedIterations: ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
        },
      })
    })

    BddTest().then('it should display a disabled enabled status badge for feedback', () => {
      const badge = findEnabledDisabledStatusBadgeIn(FEEDBACK_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(false)
    })

    BddTest().then('it should not display an iterations badge', () => {
      expect(findBadgeIn(FEEDBACK_TEST_ID).exists()).toBe(false)
    })
  })

  BddTest().when('the feedback is enabled with a finite count of iterations', () => {
    const feedbackAllowedIterations: ActivityContentDTO['feedbackAllowedIterations'] = 3

    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          feedbackAllowedIterations,
        },
      })
    })

    BddTest().then('it should display an enabled status badge for feedback', () => {
      const badge = findEnabledDisabledStatusBadgeIn(FEEDBACK_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(true)
    })

    BddTest().then('it should display the iterations count badge', () => {
      const badge = findBadgeIn(FEEDBACK_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(interpolateTranslation(FEEDBACK_ITERATIONS_LABEL, {
        count: String(feedbackAllowedIterations),
      }))
      expect(badge.props('color')).toBe(NEUTRAL_BADGE_COLOR)
      expect(badge.props('backgroundColor')).toBe(NEUTRAL_BADGE_BACKGROUND_COLOR)
      expect(badge.props('icon')).toBe(MDI_ICONS.CHAT_BUBBLE_OUTLINE)
    })
  })

  BddTest().when('the feedback is enabled with unlimited iterations', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          feedbackAllowedIterations: ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
        },
      })
    })

    BddTest().then('it should display an enabled status badge for feedback', () => {
      const badge = findEnabledDisabledStatusBadgeIn(FEEDBACK_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(true)
    })

    BddTest().then('it should display the unlimited iterations badge', () => {
      const badge = findBadgeIn(FEEDBACK_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(UNLIMITED_ITERATIONS_LABEL)
      expect(badge.props('color')).toBe(NEUTRAL_BADGE_COLOR)
      expect(badge.props('backgroundColor')).toBe(NEUTRAL_BADGE_BACKGROUND_COLOR)
    })
  })

  BddTest().when('the assessment is disabled', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          assessment: undefined,
        },
      })
    })

    BddTest().then('it should display a disabled enabled status badge for assessment', () => {
      const badge = findEnabledDisabledStatusBadgeIn(ASSESSMENT_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(false)
    })

    BddTest().then('it should not display any assessment option badge', () => {
      expect(findBadgeIn(ASSESSMENT_TEST_ID).exists()).toBe(false)
    })
  })

  BddTest().when('the assessment is enabled with a comment and a grade', () => {
    const grade: ActivityAssessmentDTO['grade'] = 20

    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          assessment: {
            comment: true,
            grade,
          },
        },
      })
    })

    BddTest().then('it should display an enabled status badge for assessment', () => {
      const badge = findEnabledDisabledStatusBadgeIn(ASSESSMENT_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(true)
    })

    BddTest().then('it should display the qualitative assessment badge', () => {
      const badge = findBadgeIn(ASSESSMENT_COMMENT_BADGE_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(ASSESSMENT_COMMENT_LABEL)
      expect(badge.props('icon')).toBe(MDI_ICONS.POST_IT_NOTES_OUTLINE)
      expect(badge.props('color')).toBe(NEUTRAL_BADGE_COLOR)
      expect(badge.props('backgroundColor')).toBe(NEUTRAL_BADGE_BACKGROUND_COLOR)
    })

    BddTest().then('it should display the grade badge with its scale', () => {
      const badge = findBadgeIn(ASSESSMENT_GRADE_BADGE_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(interpolateTranslation(ASSESSMENT_GRADE_LABEL, {
        maxGrade: String(grade),
      }))
      expect(badge.props('icon')).toBe(MDI_ICONS.CHART_TIMELINE_VARIANT_SHIMMER)
    })

    BddTest().then('it should not display the validation badge', () => {
      expect(findByTestId(ASSESSMENT_VALIDATION_BADGE_TEST_ID).exists()).toBe(false)
    })
  })

  BddTest().when('the assessment is enabled with a validation only', () => {
    beforeEach(() => {
      mountWith({
        activity: {
          ...defaultProps.activity,
          assessment: {
            validation: true,
          },
        },
      })
    })

    BddTest().then('it should display the validation badge', () => {
      const badge = findBadgeIn(ASSESSMENT_VALIDATION_BADGE_TEST_ID)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe(ASSESSMENT_VALIDATION_LABEL)
      expect(badge.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE_OUTLINE)
    })

    BddTest().then('it should not display the qualitative assessment nor the grade badges', () => {
      expect(findByTestId(ASSESSMENT_COMMENT_BADGE_TEST_ID).exists()).toBe(false)
      expect(findByTestId(ASSESSMENT_GRADE_BADGE_TEST_ID).exists()).toBe(false)
    })
  })
})
