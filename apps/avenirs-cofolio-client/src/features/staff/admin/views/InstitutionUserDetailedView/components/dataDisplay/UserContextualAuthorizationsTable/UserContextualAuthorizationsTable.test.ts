import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { ContextualAuthorizationDTO, EAuthorization } from '@/api/avenir-esr'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { EAuthorizationEntityType } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import AuthorizationTypeBadge from '@/features/staff/admin/views/InstitutionUserDetailedView/components/badges/AuthorizationTypeBadge/AuthorizationTypeBadge.vue'
import AuthorizationEntityName from '@/features/staff/admin/views/InstitutionUserDetailedView/components/base/UniversesList/AuthorizationEntityName/AuthorizationEntityName.vue'
import UserContextualAuthorizationsTable from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserContextualAuthorizationsTable/UserContextualAuthorizationsTable.vue'

const mockIsBelowLg = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isBelowLg: mockIsBelowLg }),
  }
})

const contextualAuthorizations = [
  {
    entityId: 'activity-1',
    entityName: 'Activité 1',
    entityType: EAuthorizationEntityType.ACTIVITY,
    authorizations: ['LEADER', 'EDIT'],
  },
  {
    entityId: 'activity-2',
    entityName: 'Activité 2',
    entityType: EAuthorizationEntityType.ACTIVITY_DRAFT,
    authorizations: ['FEEDBACK'],
  },
] as ContextualAuthorizationDTO[]

BddTest().given('a user contextual authorizations table', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserContextualAuthorizationsTable>>

  const stubs = {
    AvTable: AvTableStub,
    Card: CardStub,
  }

  const mountWith = async (options: {
    belowLg?: boolean
    customAuthorizations?: ContextualAuthorizationDTO[]
  } = {}) => {
    mockIsBelowLg.value = options.belowLg ?? false

    wrapper = mountComponent(UserContextualAuthorizationsTable, {
      props: {
        contextualAuthorizations: options.customAuthorizations ?? contextualAuthorizations,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getTable = () => wrapper.findComponent(AvTableStub)
  const getCardsContainer = () => wrapper.find('[data-testid="user-permissions-cards"]')
  const getCards = () => wrapper.findAllComponents(CardStub)
  const getAuthorizationBadges = () => wrapper.findAllComponents(AuthorizationTypeBadge)
  const getEntityNames = () => wrapper.findAllComponents(AuthorizationEntityName)
  const getDescriptions = () => wrapper.findAll('[data-testid="authorization-description"]')

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsBelowLg.value = false
  })

  BddTest().when('the screen is at least the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the table instead of the cards', () => {
      expect(getTable().exists()).toBe(true)
      expect(wrapper.find('[data-testid="user-permissions-table"]').exists()).toBe(true)
      expect(getCardsContainer().exists()).toBe(false)
    })

    BddTest().then('it should display a row for each contextual authorization', () => {
      expect(getTable().props('rows')).toEqual([
        {
          id: 'activity-1',
          entityName: 'Activité 1',
          entityType: EAuthorizationEntityType.ACTIVITY,
          authorization: 'LEADER',
          authorizationDescription: expect.any(String),
        },
        {
          id: 'activity-1',
          entityName: 'Activité 1',
          entityType: EAuthorizationEntityType.ACTIVITY,
          authorization: 'EDIT',
          authorizationDescription: expect.any(String),
        },
        {
          id: 'activity-2',
          entityName: 'Activité 2',
          entityType: EAuthorizationEntityType.ACTIVITY_DRAFT,
          authorization: 'FEEDBACK',
          authorizationDescription: expect.any(String),
        },
      ])
    })

    BddTest().then('it should pass the expected columns to the table', () => {
      const columns = getTable().props('columns') as AvTableColumn<{
        id: string
        entityName: string
        entityType: EAuthorizationEntityType
        authorization: EAuthorization
        authorizationDescription: string
      }>[]

      expect(columns.map(column => column.key)).toEqual([
        'entityName',
        'authorization',
        'authorizationDescription',
      ])
      expect(columns.every(column => Boolean(column.label))).toBe(true)
      expect(columns.map(column => column.width)).toEqual(['40%', '20%', '40%'])
    })

    BddTest().then('it should use id as the row key', () => {
      expect(getTable().props('rowKey')).toBe('id')
    })

    BddTest().then('it should render an entity name with navigation for each row', () => {
      expect(getEntityNames()).toHaveLength(3)
      expect(getEntityNames().map(entity => entity.props('entity'))).toEqual([
        {
          id: 'activity-1',
          name: 'Activité 1',
          type: EAuthorizationEntityType.ACTIVITY,
        },
        {
          id: 'activity-1',
          name: 'Activité 1',
          type: EAuthorizationEntityType.ACTIVITY,
        },
        {
          id: 'activity-2',
          name: 'Activité 2',
          type: EAuthorizationEntityType.ACTIVITY_DRAFT,
        },
      ])
      expect(getEntityNames().every(entity => entity.props('withNav'))).toBe(true)
    })

    BddTest().then('it should render an authorization badge for each row', () => {
      expect(getAuthorizationBadges()).toHaveLength(3)
      expect(getAuthorizationBadges().map(badge => badge.props('type'))).toEqual([
        'LEADER',
        'EDIT',
        'FEEDBACK',
      ])
    })

    BddTest().then('it should render the authorization description for each row', () => {
      expect(getDescriptions()).toHaveLength(3)
      expect(getDescriptions().every(description => description.text().length > 0)).toBe(true)
    })
  })

  BddTest().when('the screen is below the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith({ belowLg: true })
    })

    BddTest().then('it should render cards instead of the table', () => {
      expect(getCardsContainer().exists()).toBe(true)
      expect(getCards()).toHaveLength(3)
      expect(getTable().exists()).toBe(false)
    })

    BddTest().then('it should render an authorization badge for each card', () => {
      expect(getAuthorizationBadges()).toHaveLength(3)
      expect(getAuthorizationBadges().map(badge => badge.props('type'))).toEqual([
        'LEADER',
        'EDIT',
        'FEEDBACK',
      ])
    })

    BddTest().then('it should render the authorization description for each card', () => {
      expect(getDescriptions()).toHaveLength(3)
      expect(getDescriptions().every(description => description.text().length > 0)).toBe(true)
    })

    BddTest().then('it should display the entity name in each card', () => {
      const names = getCards().map(card => card.text())

      expect(names[0]).toContain('Activité 1')
      expect(names[1]).toContain('Activité 1')
      expect(names[2]).toContain('Activité 2')
    })
  })

  BddTest().when('the user has no contextual authorizations', () => {
    beforeEach(async () => {
      await mountWith({ customAuthorizations: [] })
    })

    BddTest().then('it should render an empty table', () => {
      expect(getTable().props('rows')).toEqual([])
    })
  })

  BddTest().when('the user has no contextual authorizations and the screen is below the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith({
        belowLg: true,
        customAuthorizations: [],
      })
    })

    BddTest().then('it should render an empty cards container', () => {
      expect(getCardsContainer().exists()).toBe(true)
      expect(getCards()).toHaveLength(0)
    })
  })
})
