import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { EUniverse } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { UserInfoStub } from '@/features/staff/admin/components/base/UserInfo/UserInfo.stub'
import { UniversesListStub } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/base/UniversesList/UniversesList.stub'
import UserDetailsTable from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserDetailsTable/UserDetailsTable.vue'

const mockIsBelowLg = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isBelowLg: mockIsBelowLg }),
  }
})

BddTest().given('a user details table', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserDetailsTable>>

  const user = mockExternalUserDetail

  const universes: EUniverse[] = [EUniverse.STAFF, EUniverse.STUDENT]

  const stubs = {
    AvTable: AvTableStub,
    Card: CardStub,
    UserInfo: UserInfoStub,
    UniversesList: UniversesListStub,
  }

  const mountWith = async (belowLg = false) => {
    mockIsBelowLg.value = belowLg

    wrapper = mountComponent(UserDetailsTable, {
      props: {
        user,
        universes,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getTable = () => wrapper.findComponent(AvTableStub)
  const getCardsContainer = () => wrapper.find('[data-testid="users-overview-list-cards"]')
  const getCards = () => wrapper.findAllComponents(CardStub)
  const getUserInfos = () => wrapper.findAllComponents(UserInfoStub)
  const getUniversesLists = () => wrapper.findAllComponents(UniversesListStub)

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
      expect(wrapper.find('[data-testid="users-overview-list-table"]').exists()).toBe(true)
      expect(getCardsContainer().exists()).toBe(false)
    })

    BddTest().then('it should pass the user details to the table', () => {
      expect(getTable().props('rows')).toEqual([
        {
          id: user.id,
          user,
          institution: user.institution.name,
          universes,
        },
      ])
    })

    BddTest().then('it should pass the expected columns to the table', () => {
      const columns = getTable().props('columns') as AvTableColumn<{
        id: string
        user: ExternalUserDetailDTO
        institution: string
        universes: EUniverse[]
      }>[]

      expect(columns.map(column => column.key)).toEqual([
        'user',
        'institution',
        'universes',
      ])
      expect(columns.every(column => Boolean(column.label))).toBe(true)
    })

    BddTest().then('it should use id as the row key', () => {
      expect(getTable().props('rowKey')).toBe('id')
    })

    BddTest().then('it should render the user information in the table', () => {
      expect(getUserInfos()).toHaveLength(1)
      expect(getUserInfos()[0].props('user')).toEqual(user)
    })

    BddTest().then('it should render the universes in the table', () => {
      expect(getUniversesLists()).toHaveLength(1)
      expect(getUniversesLists()[0].props('universes')).toEqual(universes)
    })
  })

  BddTest().when('the screen is below the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith(true)
    })

    BddTest().then('it should render a card instead of the table', () => {
      expect(getCardsContainer().exists()).toBe(true)
      expect(getCards()).toHaveLength(1)
      expect(getTable().exists()).toBe(false)
    })

    BddTest().then('it should render the user information in the card', () => {
      expect(getUserInfos()).toHaveLength(1)
      expect(getUserInfos()[0].props('user')).toEqual(user)
    })

    BddTest().then('it should render the institution name in the card', () => {
      expect(getCards()[0].text()).toContain(user.institution.name)
    })

    BddTest().then('it should render the universes in the card', () => {
      expect(getUniversesLists()).toHaveLength(1)
      expect(getUniversesLists()[0].props('universes')).toEqual(universes)
    })
  })
})
