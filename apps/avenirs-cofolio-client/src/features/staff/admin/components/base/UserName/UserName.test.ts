import type { VueWrapper } from '@vue/test-utils'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RouterLinkStub } from '@vue/test-utils'
import { mountWithRouter } from 'tests/utils'
import { expect, vi } from 'vitest'
import { ROUTES } from '@/common/constants'
import UserName from '@/features/staff/admin/components/base/UserName/UserName.vue'

const mockIsStaffAdminGroupsRoute = ref(false)

const route = reactive<{ name: string, params: Record<string, string> }>({
  name: ROUTES.STAFF.ADMIN.USER.name,
  params: {} as Record<string, string>,
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => route,
  }
})

vi.mock('@/common/composables/use-identify-route/use-identitfy-route', () => ({
  useIdentifyRoute: () => ({
    isStaffAdminGroupsRoute: mockIsStaffAdminGroupsRoute,
  }),
}))

BddTest().given('a user name component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserName>>

  const mockUser: UserInfoType = {
    id: 'user-1',
    firstName: 'ALICE',
    lastName: 'DUPONT',
    email: 'alice.dupont@example.com',
  }

  const stubs = { RouterLink: RouterLinkStub }

  const mountWith = async (options: {
    user?: UserInfoType
    withNav?: boolean
  } = {}) => {
    const { user = mockUser, withNav = false } = options
    wrapper = await mountWithRouter<typeof UserName>(UserName, {
      props: { user, withNav },
      global: { stubs },
    })
  }

  const getContainer = () => wrapper.get('[data-testid="user-name"]')
  const getNameContent = () => wrapper.get('[data-testid="user-name-content"]')
  const getName = () => wrapper.get('[data-testid="name"]')
  const getEmail = () => wrapper.find('[data-testid="email"]')
  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)

  beforeEach(() => {
    mockIsStaffAdminGroupsRoute.value = false
    route.name = ROUTES.STAFF.ADMIN.USER.name
    route.params = {}
  })

  BddTest().when('the component is rendered without nav', () => {
    beforeEach(async () => {
      await mountWith({ withNav: false })
    })

    BddTest().then('it should display the last name, then first name', () => {
      expect(getName().text()).toBe('Dupont Alice')
    })

    BddTest().then('it should display the user email', () => {
      expect(getEmail().text()).toBe(mockUser.email)
    })

    BddTest().then('it should expose the user id on the container and content', () => {
      expect(getContainer().attributes('data-user-id')).toBe(mockUser.id)
      expect(getNameContent().attributes('data-user-id')).toBe(mockUser.id)
    })

    BddTest().then('it should not render the router link', () => {
      expect(getRouterLink().exists()).toBe(false)
    })
  })

  BddTest().when('the component is rendered with nav activated', () => {
    beforeEach(async () => {
      await mountWith({ withNav: true })
    })

    BddTest().then('it should render the router link to user detail', () => {
      expect(getRouterLink().props('to')).toEqual({
        name: ROUTES.STAFF.ADMIN.USER.name,
        params: { id: mockUser.id },
      })
    })

    BddTest().then('it should have hoverable class', () => {
      expect(getNameContent().classes()).toContain('name--hoverable')
    })
  })

  BddTest().when('the component is rendered on group route with nav', () => {
    const groupId = 'group-1'

    beforeEach(async () => {
      mockIsStaffAdminGroupsRoute.value = true
      route.params = { id: groupId }
      await mountWith({ withNav: true })
    })

    BddTest().then('it should link to the group user detail route', () => {
      expect(getRouterLink().props('to')).toEqual({
        name: ROUTES.STAFF.ADMIN.GROUP.USER.name,
        params: { userId: mockUser.id, groupId },
      })
    })
  })

  BddTest().when('the component is rendered without an email', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          id: 'user-1',
          firstName: 'ALICE',
          lastName: 'DUPONT',
        },
      })
    })

    BddTest().then('it should not render the email address', () => {
      expect(getEmail().exists()).toBe(false)
    })
  })
})
