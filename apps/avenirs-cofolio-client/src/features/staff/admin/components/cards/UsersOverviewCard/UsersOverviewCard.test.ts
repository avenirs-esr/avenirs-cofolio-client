import type { VueWrapper } from '@vue/test-utils'
import type { GroupOverviewDTO } from '@/api/avenir-esr'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { RouterLinkStub } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { EGroupType } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ROUTES } from '@/common/constants'
import { UserInfoStub } from '@/features/staff/admin/components/base/UserInfo/UserInfo.stub'
import UsersOverviewCard from '@/features/staff/admin/components/cards/UsersOverviewCard/UsersOverviewCard.vue'

const mockIsStaffAdminGroupsRoute = ref(false)
const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useTextTruncation: () => ({ isTruncated: mockIsTruncated }),
  }
})

vi.mock('@/common/composables/use-identify-route/use-identitfy-route', () => ({
  useIdentifyRoute: () => ({
    isStaffAdminGroupsRoute: mockIsStaffAdminGroupsRoute,
  }),
}))

const mockRoute = {
  params: { id: 'group-123' },
}

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => mockRoute,
  }
})

BddTest().given('a users overview card', () => {
  let wrapper: VueWrapper<InstanceType<typeof UsersOverviewCard>>

  const mockUser: UserInfoType = {
    id: 'user-1',
    firstName: 'ALICE',
    lastName: 'DUPONT',
    email: 'alice.dupont@example.com',
  }

  const mockFormations: GroupOverviewDTO[] = [
    { id: 'f-1', name: 'Master Informatique', type: EGroupType.PROGRAM, usersCount: 10 },
    { id: 'f-2', name: 'Licence Pro', type: EGroupType.PROGRAM, usersCount: 5 },
  ]

  const mockGroups: GroupOverviewDTO[] = [
    { id: 'g-1', name: 'Groupe A', type: EGroupType.STUDENT_GROUP, usersCount: 15 },
    { id: 'g-2', name: 'Groupe B', type: EGroupType.STUDENT_GROUP, usersCount: 20 },
  ]

  const stubs = {
    AvTooltip: AvTooltipStub,
    RouterLink: RouterLinkStub,
    Card: CardStub,
    UserInfo: UserInfoStub,
  }

  const mountWith = async (options: {
    user?: UserInfoType
    formations?: GroupOverviewDTO[]
    groups?: GroupOverviewDTO[]
  } = {}) => {
    const {
      user = mockUser,
      formations = [],
      groups = [],
    } = options

    wrapper = mountComponent(UsersOverviewCard, {
      props: { user, formations, groups },
      global: { stubs },
    })
  }

  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getCard = () => wrapper.find('[data-testid="users-overview-card"]')
  const getUserInfo = () => wrapper.findComponent(UserInfoStub)
  const getFormations = () => wrapper.find('[data-testid="formations"]')
  const getGroups = () => wrapper.find('[data-testid="groups"]')
  const getTooltips = () => wrapper.findAllComponents(AvTooltipStub)

  beforeEach(() => {
    mockIsStaffAdminGroupsRoute.value = false
    mockIsTruncated.value = false
  })

  BddTest().when('the component is rendered on user list route without formations and groups', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the user information', () => {
      expect(getUserInfo().exists()).toBe(true)
      expect(getUserInfo().props('user')).toEqual(mockUser)
    })

    BddTest().then('it should expose the user id on the card', () => {
      expect(getCard().attributes('data-user-id')).toBe(mockUser.id)
    })

    BddTest().then('it should link to the user detail page', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.ADMIN.USER.name,
        params: { id: mockUser.id },
      })
    })

    BddTest().then('it should not render formations or groups', () => {
      expect(getFormations().exists()).toBe(false)
      expect(getGroups().exists()).toBe(false)
      expect(getTooltips()).toHaveLength(0)
    })
  })

  BddTest().when('the component is rendered on group route', () => {
    beforeEach(async () => {
      mockIsStaffAdminGroupsRoute.value = true
      await mountWith()
    })

    BddTest().then('it should link to the group user detail page', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.ADMIN.GROUP.USER.name,
        params: { userId: mockUser.id, groupId: 'group-123' },
      })
    })
  })

  BddTest().when('the component is rendered with formations and groups', () => {
    beforeEach(async () => {
      await mountWith({ formations: mockFormations, groups: mockGroups })
    })

    BddTest().then('it should display formations with label and joined names', () => {
      expect(getFormations().exists()).toBe(true)
      expect(getFormations().text()).toContain('Master Informatique, Licence Pro')
    })

    BddTest().then('it should display groups with label and joined names', () => {
      expect(getGroups().exists()).toBe(true)
      expect(getGroups().text()).toContain('Groupe A, Groupe B')
    })

    BddTest().then('it should disable the tooltips when text is not truncated', () => {
      expect(getTooltips()).toHaveLength(2)
      expect(getTooltips()[0].props('content')).toBe('Master Informatique, Licence Pro')
      expect(getTooltips()[0].props('disabled')).toBe(true)
      expect(getTooltips()[1].props('content')).toBe('Groupe A, Groupe B')
      expect(getTooltips()[1].props('disabled')).toBe(true)
    })
  })

  BddTest().when('the text is truncated', () => {
    beforeEach(async () => {
      mockIsTruncated.value = true
      await mountWith({ formations: mockFormations, groups: mockGroups })
    })

    BddTest().then('it should enable the tooltips', () => {
      expect(getTooltips()).toHaveLength(2)
      expect(getTooltips()[0].props('disabled')).toBe(false)
      expect(getTooltips()[1].props('disabled')).toBe(false)
    })
  })
})
