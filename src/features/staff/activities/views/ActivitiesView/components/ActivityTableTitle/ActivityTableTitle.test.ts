import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import { EActivityStatus, EActivityThematic } from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { ROUTES } from '@/common/constants'
import ActivityTableTitle, { type ActivityTableTitleProps } from '@/features/staff/activities/views/ActivitiesView/components/ActivityTableTitle/ActivityTableTitle.vue'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return { ...actual, useTextTruncation: () => ({ isTruncated: mockIsTruncated }) }
})

const baseActivity: ActivityTableRow = {
  id: 'activity-1',
  owner: '',
  status: EActivityStatus.PUBLISHED,
  thematic: EActivityThematic.SELF_KNOWLEDGE,
  title: 'Activité "Connaissance de soi"\u00A0: Définir ses valeurs',
  updatedAt: '2025-03-10T14:00:00.000Z',
}

BddTest().given('an ActivityTableTitle component', () => {
  let wrapper: ReturnType<typeof mount<typeof ActivityTableTitle>>

  const stubs = {
    ActivityThematicBadge: ActivityThematicBadgeStub,
    RouterLink: RouterLinkStub,
    AvTooltip: AvTooltipStub
  }

  const mountWith = (props: Partial<ActivityTableTitleProps> = {}) => {
    vi.clearAllMocks()
    wrapper = mount(ActivityTableTitle, {
      props: {
        activity: baseActivity,
        ...props
      },
      global: { stubs },
    })
  }

  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getThematicBadge = () => wrapper.findComponent({ name: 'ActivityThematicBadge' })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the activity title inside the link', () => {
      expect(getRouterLink().text()).toContain(baseActivity.title)
    })

    BddTest().then('it should link to the activity details route with correct params', () => {
      expect(getRouterLink().props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
        params: { id: baseActivity.id, status: baseActivity.status },
      })
    })

    BddTest().then('it should render the thematic badge with the correct thematic', () => {
      expect(getThematicBadge().props('thematic')).toBe(baseActivity.thematic)
    })
  })

  BddTest().when('the component is mounted with a different thematic', () => {
    const activity: ActivityTableRow = {
      ...baseActivity,
      thematic: EActivityThematic.EXPERIENCES,
    }

    beforeEach(() => {
      mountWith({ activity })
    })

    BddTest().then('it should pass the updated thematic to the badge', () => {
      expect(getThematicBadge().props('thematic')).toBe(activity.thematic)
    })
  })

  BddTest().when('the component is mounted without thematic', () => {
    const activity: ActivityTableRow = {
      ...baseActivity,
      thematic: undefined,
    }

    beforeEach(() => {
      mountWith({ activity })
    })

    BddTest().then('it should not render the thematic badge', () => {
      expect(getThematicBadge().exists()).toBe(false)
    })

    BddTest().then('it should still render the activity title inside the link', () => {
      expect(getRouterLink().text()).toContain(baseActivity.title)
    })
  })

  BddTest().when('the component is mounted with a different activity id and status', () => {
    const activity: ActivityTableRow = {
      ...baseActivity,
      id: 'activity-42',
      status: EActivityStatus.DRAFT,
    }

    beforeEach(() => {
      mountWith({ activity })
    })

    BddTest().then('it should update the route params accordingly', () => {
      expect(getRouterLink().props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
        params: { id: activity.id, status: activity.status },
      })
    })
  })
})
