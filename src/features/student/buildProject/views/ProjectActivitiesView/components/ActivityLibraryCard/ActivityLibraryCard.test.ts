import { EActivityThematic, EDeclaredActivityStatus } from '@/api/avenir-esr'
import {
  ActivityPeriodSummaryBadgeStub
} from '@/features/student/buildProject/components/badges/ActivityPeriodSummaryBadge/ActivityPeriodSummaryBadge.stub'
import {
  ActivityStatusBadgeStub
} from '@/features/student/buildProject/components/badges/ActivityStatusBadge/ActivityStatusBadge.stub'
import {
  ActivityThematicBadgeStub
} from '@/features/student/buildProject/components/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import ActivityLibraryCard from '@/features/student/buildProject/views/ProjectActivitiesView/components/ActivityLibraryCard/ActivityLibraryCard.vue'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile
    })
  }
})

BddTest().given('an ActivityLibraryCard', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityLibraryCard>>

  const stubs = {
    FloatingIconCard: FloatingIconCardStub,
    ActivityStatusBadge: ActivityStatusBadgeStub,
    ActivityThematicBadge: ActivityThematicBadgeStub,
    ActivityPeriodSummaryBadge: ActivityPeriodSummaryBadgeStub,
    RouterLink: RouterLinkStub
  }

  const baseActivity = {
    id: '1',
    activityId: '1',
    title: 'Activité "Connaissance de soi" : Définir ses valeurs',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    status: EDeclaredActivityStatus.SUBSCRIBED,
    summary: 'Une activité de connaissance de soi.',
    executionPeriodInfoSummary: 'À faire cette année',
    startDate: '2025-09-01T00:00:00.000Z',
    endDate: '2026-06-30T00:00:00.000Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsMobile.value = false
  })

  BddTest().when('the component is mounted with complete data', () => {
    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      wrapper = mount(ActivityLibraryCard, {
        props: { activity: baseActivity },
        global: { stubs }
      })
      floatingCard = wrapper.findComponent({ name: 'FloatingIconCard' }) as VueWrapper<InstanceType<typeof FloatingIconCardStub>>
    })

    BddTest().then('it should render FloatingIconCard', () => {
      expect(floatingCard.exists()).toBe(true)
    })

    BddTest().then('it should pass the activity title to FloatingIconCard', () => {
      expect(floatingCard.props('title')).toBe(baseActivity.title)
    })

    BddTest().then('it should pass surface background color to FloatingIconCard', () => {
      expect(floatingCard.props('color')).toBe('var(--surface-background)')
    })

    BddTest().then('it should pass headerRows 2 to FloatingIconCard', () => {
      expect(floatingCard.props('headerRows')).toBe(2)
    })

    BddTest().then('it should pass auto customTitleHeight to FloatingIconCard', () => {
      expect(floatingCard.props('customTitleHeight')).toBe('auto')
    })

    BddTest().then('it should render ActivityStatusBadge with correct status', () => {
      const statusBadge = wrapper.findComponent({ name: 'ActivityStatusBadge' })
      expect(statusBadge.exists()).toBe(true)
      expect(statusBadge.props('status')).toBe(EDeclaredActivityStatus.SUBSCRIBED)
    })

    BddTest().then('it should render ActivityThematicBadge with correct thematic', () => {
      const thematicBadge = wrapper.findComponent({ name: 'ActivityThematicBadge' })
      expect(thematicBadge.exists()).toBe(true)
      expect(thematicBadge.props('thematic')).toBe(EActivityThematic.SELF_KNOWLEDGE)
    })

    BddTest().then('it should render the period badge', () => {
      const periodBadge = wrapper.findComponent(ActivityPeriodSummaryBadgeStub)
      expect(periodBadge.exists()).toBe(true)
    })

    BddTest().then('it should render the period badge with the correct label', () => {
      const periodBadge = wrapper.findComponent(ActivityPeriodSummaryBadgeStub)
      expect(periodBadge.props('summary')).toBe(baseActivity.executionPeriodInfoSummary)
    })

    BddTest().then('it should display the summary text', () => {
      expect(wrapper.text()).toContain(baseActivity.summary)
    })
  })

  BddTest().when('the component is mounted without startDate', () => {
    beforeEach(() => {
      wrapper = mount(ActivityLibraryCard, {
        props: {
          activity: { ...baseActivity, executionPeriodInfoSummary: undefined }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should not render the period badge', () => {
      const periodBadge = wrapper.findComponent(ActivityPeriodSummaryBadgeStub)
      expect(periodBadge.exists()).toBe(false)
    })
  })

  BddTest().when('the component is on mobile', () => {
    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      mockIsMobile.value = true
      wrapper = mount(ActivityLibraryCard, {
        props: { activity: baseActivity },
        global: { stubs }
      })
      floatingCard = wrapper.findComponent({ name: 'FloatingIconCard' }) as VueWrapper<InstanceType<typeof FloatingIconCardStub>>
    })

    BddTest().then('it should use caption-regular typography class', () => {
      expect(floatingCard.props('titleTypographyClasses')).toContain('caption-regular')
    })
  })

  BddTest().when('the component is on desktop', () => {
    let floatingCard: VueWrapper<InstanceType<typeof FloatingIconCardStub>>

    beforeEach(() => {
      mockIsMobile.value = false
      wrapper = mount(ActivityLibraryCard, {
        props: { activity: baseActivity },
        global: { stubs }
      })
      floatingCard = wrapper.findComponent({ name: 'FloatingIconCard' }) as VueWrapper<InstanceType<typeof FloatingIconCardStub>>
    })

    BddTest().then('it should use n5 typography class', () => {
      expect(floatingCard.props('titleTypographyClasses')).toContain('n5')
    })
  })
})
