import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import { EActivityStatus, EActivityThematic } from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { ROUTES } from '@/common/constants'
import ActivityTableTitle from '@/features/staff/activities/views/ActivitiesView/components/ActivityTableTitle/ActivityTableTitle.vue'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return { ...actual, useTextTruncation: () => ({ isTruncated: mockIsTruncated }) }
})

BddTest().given('an ActivityTableTitle component', () => {
  let wrapper: ReturnType<typeof mount<typeof ActivityTableTitle>>

  const stubs = {
    ActivityThematicBadge: ActivityThematicBadgeStub,
    RouterLink: RouterLinkStub,
    AvTooltip: AvTooltipStub
  }

  const baseActivity: ActivityTableRow = {
    id: 'activity-1',
    owner: '',
    status: EActivityStatus.PUBLISHED,
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    title: 'Activité "Connaissance de soi" : Définir ses valeurs',
    updatedAt: '2025-03-10T14:00:00.000Z',
  }

  BddTest().when('the component is mounted', () => {
    let link: VueWrapper<InstanceType<typeof RouterLinkStub>>

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(ActivityTableTitle, {
        props: { activity: baseActivity },
        global: { stubs },
      })
      link = wrapper.findComponent(RouterLinkStub)
    })

    BddTest().then('it should render the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the activity title inside the link', () => {
      expect(link.text()).toContain(baseActivity.title)
    })

    BddTest().then('it should link to the activity details route with correct params', () => {
      expect(link.props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
        params: { id: baseActivity.id, status: baseActivity.status },
      })
    })

    BddTest().then('it should render the thematic badge with the correct thematic', () => {
      expect(wrapper.findComponent({ name: 'ActivityThematicBadge' }).props('thematic')).toBe(EActivityThematic.SELF_KNOWLEDGE)
    })
  })

  BddTest().when('the component is mounted with a different thematic', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(ActivityTableTitle, {
        props: {
          activity: {
            ...baseActivity,
            thematic: EActivityThematic.EXPERIENCES,
          },
        },
        global: { stubs },
      })
    })

    BddTest().then('it should pass the updated thematic to the badge', () => {
      expect(wrapper.findComponent({ name: 'ActivityThematicBadge' }).props('thematic')).toBe(EActivityThematic.EXPERIENCES)
    })
  })

  BddTest().when('the component is mounted with a different activity id and status', () => {
    let link: VueWrapper<InstanceType<typeof RouterLinkStub>>

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(ActivityTableTitle, {
        props: {
          activity: {
            ...baseActivity,
            id: 'activity-42',
            status: EActivityStatus.DRAFT,
          },
        },
        global: { stubs },
      })
      link = wrapper.findComponent(RouterLinkStub)
    })

    BddTest().then('it should update the route params accordingly', () => {
      expect(link.props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
        params: { id: 'activity-42', status: EActivityStatus.DRAFT },
      })
    })
  })
})
