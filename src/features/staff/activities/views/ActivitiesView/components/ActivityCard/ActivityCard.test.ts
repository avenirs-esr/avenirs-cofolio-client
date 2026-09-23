import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import { EActivityStatus, EActivityThematic } from '@/api/avenir-esr'
import { ActivityStatusBadgeStub } from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.stub'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ROUTES } from '@/common/constants'
import ActivityCard, { type ActivityCardProps } from '@/features/staff/activities/views/ActivitiesView/components/ActivityCard/ActivityCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvIconStub, AvIconTextStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return { ...actual, useTextTruncation: () => ({ isTruncated: mockIsTruncated }) }
})

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
    AvTooltip: AvTooltipStub
  }

  const baseActivity: ActivityTableRow = {
    id: 'activity-1',
    owner: 'Marie Curie',
    status: EActivityStatus.PUBLISHED,
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    title: 'Activite de test tres longue pour verifier le rendu du titre',
    updatedAt: '2025-03-10T14:00:00.000Z',
  }

  const activityWithoutThematic: ActivityTableRow = {
    ...baseActivity,
    thematic: undefined,
  }

  const mountWith = (props: Partial<ActivityCardProps> = {}) => {
    wrapper = mountComponent(ActivityCard, {
      props: {
        activity: baseActivity,
        ...props
      },
      global: { stubs },
    })
  }

  const getCard = () => wrapper.findComponent(CardStub)
  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getThematicBadge = () => wrapper.findComponent(ActivityThematicBadgeStub)
  const getStatusBadge = () => wrapper.findComponent(ActivityStatusBadgeStub)
  const getIconTexts = () => wrapper.findAllComponents(AvIconTextStub)
  const getBadgesContainer = () => wrapper.find('[data-testid="activity-card-badges"]')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the card component', () => {
      const card = getCard()
      expect(card.exists()).toBe(true)
      expect(card.props('backgroundColor')).toBe('var(--card)')
      expect(card.props('titleBackground')).toBe('var(--card)')
    })

    BddTest().then('it should render the title link to the activity details route', () => {
      const link = getRouterLink()
      expect(link.exists()).toBe(true)
      expect(link.text()).toContain(baseActivity.title)
      expect(link.props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
        params: { id: baseActivity.id, status: baseActivity.status },
      })
    })

    BddTest().then('it should render the badges container', () => {
      expect(getBadgesContainer().exists()).toBe(true)
    })

    BddTest().then('it should render the thematic badge with the activity value', () => {
      const thematic = getThematicBadge()
      expect(thematic.exists()).toBe(true)
      expect(thematic.props('thematic')).toBe(baseActivity.thematic)
    })

    BddTest().then('it should not render the status badge', () => {
      const status = getStatusBadge()
      expect(status.exists()).toBe(false)
    })

    BddTest().then('it should render owner and updated labels', () => {
      const iconTexts = getIconTexts()

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
      mountWith({ withStatus: true })
    })

    BddTest().then('it should render the status badge with the activity value', () => {
      const status = getStatusBadge()
      expect(status.exists()).toBe(true)
      expect(status.props('status')).toBe(baseActivity.status)
    })
  })

  BddTest().when('the component is mounted without thematic', () => {
    beforeEach(() => {
      mountWith({ activity: activityWithoutThematic })
    })

    BddTest().then('it should not render the thematic badge', () => {
      expect(getThematicBadge().exists()).toBe(false)
    })

    BddTest().then('it should not render the empty badges container', () => {
      expect(getBadgesContainer().exists()).toBe(false)
    })

    BddTest().then('it should still render owner and updated labels', () => {
      const iconTexts = getIconTexts()

      expect(iconTexts).toHaveLength(2)
      expect(iconTexts[0].props('text')).toContain(activityWithoutThematic.owner)
      expect(iconTexts[1].props('text')).toContain(`formatted-${activityWithoutThematic.updatedAt}`)
    })
  })

  BddTest().when('the component is mounted without thematic and with withStatus=true', () => {
    beforeEach(() => {
      mountWith({ activity: activityWithoutThematic, withStatus: true })
    })

    BddTest().then('it should render the badges container', () => {
      expect(getBadgesContainer().exists()).toBe(true)
    })

    BddTest().then('it should not render the thematic badge', () => {
      expect(getThematicBadge().exists()).toBe(false)
    })

    BddTest().then('it should render the status badge with the activity value', () => {
      const status = getStatusBadge()
      expect(status.exists()).toBe(true)
      expect(status.props('status')).toBe(activityWithoutThematic.status)
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
      mountWith({ activity: otherActivity })
    })

    BddTest().then('it should update route and badges accordingly', () => {
      const link = getRouterLink()
      const thematic = getThematicBadge()

      expect(link.props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
        params: { id: otherActivity.id, status: otherActivity.status },
      })
      expect(thematic.props('thematic')).toBe(otherActivity.thematic)
    })

    BddTest().then('it should use the updated date for formatting', () => {
      const iconTexts = getIconTexts()
      expect(iconTexts[1].props('text')).toContain(`formatted-${otherActivity.updatedAt}`)
      expect(mockFormatLastModified).toHaveBeenCalledWith(otherActivity.updatedAt)
    })
  })
})
