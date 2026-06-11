import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import { EActivityStatus, EActivityThematic } from '@/api/avenir-esr'
import { ActivityStatusBadgeStub } from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.stub'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ROUTES } from '@/common/constants'
import ActivityCard from '@/features/staff/activities/views/ActivitiesView/components/ActivityCard/ActivityCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvIconStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockFormatLastModified = vi.fn((value: string) => `formatted-${value}`)

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useDateUtils: () => ({
      formatLastModified: mockFormatLastModified,
    }),
  }
})

BddTest().given('an ActivityCard component', () => {
  let wrapper: ReturnType<typeof mountComponent<typeof ActivityCard>>

  const stubs = {
    Card: CardStub,
    AvIcon: AvIconStub,
    AvIconText: AvIconTextStub,
    ActivityThematicBadge: ActivityThematicBadgeStub,
    ActivityStatusBadge: ActivityStatusBadgeStub,
    RouterLink: RouterLinkStub,
  }

  const baseActivity: ActivityTableRow = {
    id: 'activity-1',
    owner: 'Marie Curie',
    status: EActivityStatus.PUBLISHED,
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    title: 'Activite de test tres longue pour verifier le rendu du titre',
    updatedAt: '2025-03-10T14:00:00.000Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityCard, {
        props: { activity: baseActivity },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card component', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.exists()).toBe(true)
      expect(card.props('backgroundColor')).toBe('var(--card)')
      expect(card.props('titleBackground')).toBe('var(--card)')
    })

    BddTest().then('it should render the title link to the activity details route', () => {
      const link = wrapper.findComponent(RouterLinkStub)
      expect(link.exists()).toBe(true)
      expect(link.text()).toContain(baseActivity.title)
      expect(link.props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
        params: { id: baseActivity.id, status: baseActivity.status },
      })
    })

    BddTest().then('it should render the thematic badge with the activity value', () => {
      const thematic = wrapper.findComponent(ActivityThematicBadgeStub)
      expect(thematic.exists()).toBe(true)
      expect(thematic.props('thematic')).toBe(baseActivity.thematic)
    })

    BddTest().then('it should not render the status badge', () => {
      const status = wrapper.findComponent(ActivityStatusBadgeStub)
      expect(status.exists()).toBe(false)
    })

    BddTest().then('it should render owner and updated labels', () => {
      const iconTexts = wrapper.findAllComponents(AvIconTextStub)

      expect(iconTexts).toHaveLength(2)
      expect(iconTexts[0].props('icon')).toBe(MDI_ICONS.PERSON_OUTLINE)
      expect(iconTexts[0].props('text')).toContain(baseActivity.owner)
      expect(iconTexts[1].props('icon')).toBe(MDI_ICONS.CLOCK_ARROW)
      expect(iconTexts[1].props('text')).toContain(`formatted-${baseActivity.updatedAt}`)
      expect(mockFormatLastModified).toHaveBeenCalledWith(baseActivity.updatedAt)
    })
  })

  BddTest().when('the component is mounted with withStatus=true', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityCard, {
        props: { activity: baseActivity, withStatus: true },
        global: { stubs },
      })
    })

    BddTest().then('it should render the status badge with the activity value', () => {
      const status = wrapper.findComponent(ActivityStatusBadgeStub)
      expect(status.exists()).toBe(true)
      expect(status.props('status')).toBe(baseActivity.status)
    })
  })

  BddTest().when('the component is mounted with a different activity', () => {
    const otherActivity: ActivityTableRow = {
      id: 'activity-42',
      owner: 'Ada Lovelace',
      status: EActivityStatus.DRAFT,
      thematic: EActivityThematic.EXPERIENCES,
      title: 'Autre activite',
      updatedAt: '2024-01-02T10:30:00.000Z',
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityCard, {
        props: { activity: otherActivity },
        global: { stubs },
      })
    })

    BddTest().then('it should update route and badges accordingly', () => {
      const link = wrapper.findComponent(RouterLinkStub)
      const thematic = wrapper.findComponent(ActivityThematicBadgeStub)

      expect(link.props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
        params: { id: otherActivity.id, status: otherActivity.status },
      })
      expect(thematic.props('thematic')).toBe(otherActivity.thematic)
    })

    BddTest().then('it should use the updated date for formatting', () => {
      const iconTexts = wrapper.findAllComponents(AvIconTextStub)
      expect(iconTexts[1].props('text')).toContain(`formatted-${otherActivity.updatedAt}`)
      expect(mockFormatLastModified).toHaveBeenCalledWith(otherActivity.updatedAt)
    })
  })
})
