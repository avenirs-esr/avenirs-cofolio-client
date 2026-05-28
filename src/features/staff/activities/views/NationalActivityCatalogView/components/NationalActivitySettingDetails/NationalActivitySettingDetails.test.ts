import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { ICONS } from '@/common/constants'
import {
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED,
  ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY,
  ACTIVITY_TRACE_SETTING_DISABLED_VALUE
} from '@/features/staff/activities/config'
import NationalActivitySettingDetails from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySettingDetails/NationalActivitySettingDetails.vue'
import { FormFieldCardContainerStub } from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.stub'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a national activity setting details component', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivitySettingDetails>>

  const stubs = {
    FormFieldCardContainer: FormFieldCardContainerStub,
    AvBadge: AvBadgeStub,
  }

  const mountWith = (activity = mockedActivityContent) => {
    wrapper = mount(NationalActivitySettingDetails, {
      props: { activity },
      global: { stubs },
    })
  }

  const findBadgeIn = (testid: string) =>
    wrapper.find(`[data-testid="${testid}"]`).findComponent(AvBadgeStub)

  const findBadgesIn = (testid: string) =>
    wrapper.find(`[data-testid="${testid}"]`).findAllComponents(AvBadgeStub)

  const findCardIn = (testid: string) =>
    wrapper.find(`[data-testid="${testid}"]`).findComponent(FormFieldCardContainerStub)

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

    BddTest().then('it should display a disabled badge for reflection', () => {
      const badge = findBadgeIn('national-activity-setting-details-reflection')
      expect(badge.props('label')).toBe('Désactivée')
      expect(badge.props('color')).toBe('var(--light-foreground-error)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-error)')
      expect(badge.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE)
    })
  })

  BddTest().when('the reflection is enabled', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, enableReflection: true })
    })

    BddTest().then('it should display an enabled badge for reflection', () => {
      const badge = findBadgeIn('national-activity-setting-details-reflection')
      expect(badge.props('label')).toBe('Activée')
      expect(badge.props('color')).toBe('var(--light-foreground-success)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-success)')
      expect(badge.props('icon')).toBe(MDI_ICONS.CHECK_CIRCLE)
    })
  })

  BddTest().when('the trace association is disabled', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, traceAllowedAssociations: ACTIVITY_TRACE_SETTING_DISABLED_VALUE })
    })

    BddTest().then('it should display a disabled badge for trace association', () => {
      const badge = findBadgeIn('national-activity-setting-details-trace')
      expect(badge.props('label')).toBe('Désactivée')
      expect(badge.props('color')).toBe('var(--light-foreground-error)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-error)')
    })
  })

  BddTest().when('the trace association is enabled', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, traceAllowedAssociations: 5 })
    })

    BddTest().then('it should display an enabled badge for trace association', () => {
      const badge = findBadgeIn('national-activity-setting-details-trace')
      expect(badge.props('label')).toBe('Activée')
      expect(badge.props('color')).toBe('var(--light-foreground-success)')
      expect(badge.props('backgroundColor')).toBe('var(--light-background-success)')
    })
  })

  BddTest().when('the feedback is disabled', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, feedbackAllowedIterations: ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED })
    })

    BddTest().then('it should display only a disabled badge for feedback', () => {
      const badges = findBadgesIn('national-activity-setting-details-feedback')
      expect(badges).toHaveLength(1)
      expect(badges[0].props('label')).toBe('Désactivée')
      expect(badges[0].props('color')).toBe('var(--light-foreground-error)')
      expect(badges[0].props('backgroundColor')).toBe('var(--light-background-error)')
    })
  })

  BddTest().when('the feedback is enabled with a finite count of iterations', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, feedbackAllowedIterations: 3 })
    })

    BddTest().then('it should display an enabled badge for feedback', () => {
      const badges = findBadgesIn('national-activity-setting-details-feedback')
      expect(badges).toHaveLength(2)
      expect(badges[0].props('label')).toBe('Activée')
      expect(badges[0].props('color')).toBe('var(--light-foreground-success)')
      expect(badges[0].props('backgroundColor')).toBe('var(--light-background-success)')
    })

    BddTest().then('it should display the iterations count badge', () => {
      const badges = findBadgesIn('national-activity-setting-details-feedback')
      expect(badges[1].props('label')).toBe('3 itérations')
      expect(badges[1].props('color')).toBe('var(--light-foreground-neutral)')
      expect(badges[1].props('backgroundColor')).toBe('var(--light-background-neutral)')
      expect(badges[1].props('icon')).toBe(MDI_ICONS.CHAT_BUBBLE_OUTLINE)
    })
  })

  BddTest().when('the feedback is enabled with unlimited iterations', () => {
    beforeEach(() => {
      mountWith({ ...mockedActivityContent, feedbackAllowedIterations: ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_INFINITY })
    })

    BddTest().then('it should display an enabled badge for feedback', () => {
      const badges = findBadgesIn('national-activity-setting-details-feedback')
      expect(badges).toHaveLength(2)
      expect(badges[0].props('label')).toBe('Activée')
    })

    BddTest().then('it should display the unlimited iterations badge', () => {
      const badges = findBadgesIn('national-activity-setting-details-feedback')
      expect(badges[1].props('label')).toBe('Itérations illimitées')
      expect(badges[1].props('color')).toBe('var(--light-foreground-neutral)')
      expect(badges[1].props('backgroundColor')).toBe('var(--light-background-neutral)')
    })
  })
})
