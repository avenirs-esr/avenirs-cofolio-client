import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { EnabledDisabledStatusBadgeStub } from '@/common/components/EnabledDisabledStatusBadge/EnabledDisabledStatusBadge.stub'
import { ICONS } from '@/common/constants'
import {
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
  ACTIVITY_TRACE_SETTING_DISABLED_VALUE,
  ACTIVITY_TRACE_SETTING_INFINITY_VALUE
} from '@/features/staff/activities/config'
import NationalActivitySettingDetails from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySettingDetails/NationalActivitySettingDetails.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a national activity setting details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivitySettingDetails>>

  const stubs = {
    IconTitleCardContainer: IconTitleCardContainerStub,
    AvBadge: AvBadgeStub,
    EnabledDisabledStatusBadge: EnabledDisabledStatusBadgeStub,
  }

  const mountWith = (activity = mockedActivityContent) => {
    wrapper = mount(NationalActivitySettingDetails, {
      props: { activity },
      global: { stubs },
    })
  }

  const findEnabledDisabledStatusBadgeIn = (testid: string) =>
    wrapper.find(`[data-testid="${testid}"]`).findComponent(EnabledDisabledStatusBadgeStub)

  const findIterationsBadgeIn = (testid: string) =>
    wrapper.find(`[data-testid="${testid}"]`).findComponent(AvBadgeStub)

  const findCardIn = (testid: string) =>
    wrapper.find(`[data-testid="${testid}"]`).findComponent(IconTitleCardContainerStub)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with the default mocked activity', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the modalities container with proper title and icon', () => {
      const container = findCardIn('national-activity-setting-details')
      expect(container.exists()).toBe(true)
      expect(container.props('title')).toBe('Modalités')
      expect(container.props('titleIcon')).toBe(MDI_ICONS.SETTINGS)
    })

    BddTest().then('it should render the reflection card with proper title and icon', () => {
      const card = findCardIn('national-activity-setting-details-reflection')
      expect(card.exists()).toBe(true)
      expect(card.props('title')).toBe('Prise de recul')
      expect(card.props('titleIcon')).toBe(MDI_ICONS.TEXT_BOX_EDIT_OUTLINE)
    })

    BddTest().then('it should render the trace card with proper title and icon', () => {
      const card = findCardIn('national-activity-setting-details-trace')
      expect(card.exists()).toBe(true)
      expect(card.props('title')).toBe('Association de traces')
      expect(card.props('titleIcon')).toBe(MDI_ICONS.ATTACH_FILE)
    })

    BddTest().then('it should render the feedback card with proper title and icon', () => {
      const card = findCardIn('national-activity-setting-details-feedback')
      expect(card.exists()).toBe(true)
      expect(card.props('title')).toBe('Demande de feedback')
      expect(card.props('titleIcon')).toBe(ICONS.FEEDBACK)
    })
  })

  BddTest().when('the reflection is disabled', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, enableReflection: false })
    })

    BddTest().then('it should display a disabled enabled status badge for reflection', () => {
      const badge = findEnabledDisabledStatusBadgeIn('national-activity-setting-details-reflection')
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(false)
    })
  })

  BddTest().when('the reflection is enabled', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, enableReflection: true })
    })

    BddTest().then('it should display an enabled status badge for reflection', () => {
      const badge = findEnabledDisabledStatusBadgeIn('national-activity-setting-details-reflection')
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(true)
    })
  })

  BddTest().when('the trace association is disabled', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, traceAllowedAssociations: ACTIVITY_TRACE_SETTING_DISABLED_VALUE })
    })

    BddTest().then('it should display a disabled enabled status badge for trace association', () => {
      const badge = findEnabledDisabledStatusBadgeIn('national-activity-setting-details-trace')
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(false)
    })

    BddTest().then('it should not display a trace association badge', () => {
      const badge = findIterationsBadgeIn('national-activity-setting-details-trace')
      expect(badge.exists()).toBe(false)
    })
  })

  BddTest().when('the trace association is enabled', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, traceAllowedAssociations: 5 })
    })

    BddTest().then('it should display an enabled status badge for trace association', () => {
      const badge = findEnabledDisabledStatusBadgeIn('national-activity-setting-details-trace')
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(true)
    })

    BddTest().then('it should display the trace association count badge', () => {
      const badge = findIterationsBadgeIn('national-activity-setting-details-trace')

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('5 traces')
      expect(badge.props('color')).toBe('var(--light-foreground-neutral)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-neutral)')
      expect(badge.props('icon')).toBe(MDI_ICONS.ATTACH_FILE)
    })
  })

  BddTest().when('the trace association is enabled with unlimited traces', () => {
    beforeEach(() => {
      mountWith({
        ...mockedActivityContent,
        traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
      })
    })

    BddTest().then('it should display the unlimited traces badge', () => {
      const badge = findIterationsBadgeIn('national-activity-setting-details-trace')

      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('Traces illimitées')
      expect(badge.props('color')).toBe('var(--light-foreground-neutral)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-neutral)')
      expect(badge.props('icon')).toBe(MDI_ICONS.ATTACH_FILE)
    })
  })

  BddTest().when('the feedback is disabled', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, feedbackAllowedIterations: ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED })
    })

    BddTest().then('it should display a disabled enabled status badge for feedback', () => {
      const badge = findEnabledDisabledStatusBadgeIn('national-activity-setting-details-feedback')
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(false)
    })

    BddTest().then('it should not display an iterations badge', () => {
      const iterationsBadge = findIterationsBadgeIn('national-activity-setting-details-feedback')
      expect(iterationsBadge.exists()).toBe(false)
    })
  })

  BddTest().when('the feedback is enabled with a finite count of iterations', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, feedbackAllowedIterations: 3 })
    })

    BddTest().then('it should display an enabled status badge for feedback', () => {
      const badge = findEnabledDisabledStatusBadgeIn('national-activity-setting-details-feedback')
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(true)
    })

    BddTest().then('it should display the iterations count badge', () => {
      const iterationsBadge = findIterationsBadgeIn('national-activity-setting-details-feedback')
      expect(iterationsBadge.exists()).toBe(true)
      expect(iterationsBadge.props('label')).toBe('3 itérations')
      expect(iterationsBadge.props('color')).toBe('var(--light-foreground-neutral)')
      expect(iterationsBadge.props('backgroundColor')).toBe('var(--light-background-neutral)')
      expect(iterationsBadge.props('icon')).toBe(MDI_ICONS.CHAT_BUBBLE_OUTLINE)
    })
  })

  BddTest().when('the feedback is enabled with unlimited iterations', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, feedbackAllowedIterations: ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY })
    })

    BddTest().then('it should display an enabled status badge for feedback', () => {
      const badge = findEnabledDisabledStatusBadgeIn('national-activity-setting-details-feedback')
      expect(badge.exists()).toBe(true)
      expect(badge.props('enabled')).toBe(true)
    })

    BddTest().then('it should display the unlimited iterations badge', () => {
      const iterationsBadge = findIterationsBadgeIn('national-activity-setting-details-feedback')
      expect(iterationsBadge.exists()).toBe(true)
      expect(iterationsBadge.props('label')).toBe('Itérations illimitées')
      expect(iterationsBadge.props('color')).toBe('var(--light-foreground-neutral)')
      expect(iterationsBadge.props('backgroundColor')).toBe('var(--light-background-neutral)')
    })
  })
})
