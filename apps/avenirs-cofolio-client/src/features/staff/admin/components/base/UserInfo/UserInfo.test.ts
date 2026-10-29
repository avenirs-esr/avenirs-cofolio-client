import type { VueWrapper } from '@vue/test-utils'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, RouterLinkStub } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { ROUTES } from '@/common/constants'
import UserInfo from '@/features/staff/admin/components/base/UserInfo/UserInfo.vue'

const mockIsStaffAdminGroupsRoute = ref(false)

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

const mockObjectUrl = 'blob:http://localhost/profile-picture'
const mockCreateObjectURL = vi.fn(() => mockObjectUrl)
const mockRevokeObjectURL = vi.fn()

const OriginalURL = URL

class MockURL extends OriginalURL {
  static createObjectURL = mockCreateObjectURL
  static revokeObjectURL = mockRevokeObjectURL
}

BddTest().given('a user information component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserInfo>>

  const userWithoutPicture: UserInfoType = {
    id: 'user-1',
    firstName: 'ALICE',
    lastName: 'DUPONT',
    email: 'alice.dupont@example.com',
    profilePictureId: undefined,
  }

  const userWithPicture: UserInfoType = {
    ...userWithoutPicture,
    profilePictureId: 'TEST_ID',
  }

  const stubs = {
    AvIcon: AvIconStub,
    RouterLink: RouterLinkStub,
  }

  const mountWith = async (user: UserInfoType = userWithoutPicture, withNav = false) => {
    wrapper = mountComponent(UserInfo, {
      props: { user, withNav },
      global: { stubs },
    })

    await flushPromises()
  }

  const getContainer = () => wrapper.find('[data-testid="user-info"]')
  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getName = () => wrapper.find('[data-testid="name"]')
  const getEmail = () => wrapper.find('[data-testid="email"]')
  const getProfilePicture = () => wrapper.find('[data-testid="profile-picture"]')
  const getDefaultAccountIcon = () => wrapper.find('[data-testid="default-account-icon"]')

  beforeEach(() => {
    vi.stubGlobal('URL', MockURL)
    mockIsStaffAdminGroupsRoute.value = false
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted without a profile picture', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should display the capitalized full name', () => {
      expect(getName().text()).toBe('Alice Dupont')
    })

    BddTest().then('it should display the email address', () => {
      expect(getEmail().text()).toBe('alice.dupont@example.com')
    })

    BddTest().then('it should display the default account icon', () => {
      expect(getDefaultAccountIcon().exists()).toBe(true)
    })

    BddTest().then('it should not display the profile picture', () => {
      expect(getProfilePicture().exists()).toBe(false)
    })
  })

  BddTest().when('the component is rendered on user list route with nav activated', () => {
    beforeEach(async () => {
      await mountWith(userWithoutPicture, true)
    })

    BddTest().then('it should display the capitalized full name', () => {
      expect(getName().text()).toBe('Alice Dupont')
    })

    BddTest().then('it should expose the user id on the container', () => {
      expect(getContainer().attributes('data-user-id')).toBe(userWithoutPicture.id)
    })

    BddTest().then('it should link to the user detail page', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.ADMIN.USER.name,
        params: { id: userWithoutPicture.id },
      })
    })
  })

  BddTest().when('the component is rendered on group route with nav activated', () => {
    beforeEach(async () => {
      mockIsStaffAdminGroupsRoute.value = true
      await mountWith(userWithoutPicture, true)
    })

    BddTest().then('it should link to the group user detail page', () => {
      expect(getRouterLink().props('to')).toStrictEqual({
        name: ROUTES.STAFF.ADMIN.GROUP.USER.name,
        params: { userId: userWithoutPicture.id, groupId: 'group-123' },
      })
    })
  })

  BddTest().when('the component is rendered without nav activated', () => {
    beforeEach(async () => {
      await mountWith(userWithoutPicture, false)
    })

    BddTest().then('it should not render the router link', () => {
      expect(getRouterLink().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a profile picture', () => {
    beforeEach(async () => {
      await mountWith(userWithPicture)
    })

    BddTest().then('it should display the email address', () => {
      expect(getEmail().text()).toBe('alice.dupont@example.com')
    })

    BddTest().then('it should display the profile picture', () => {
      expect(getProfilePicture().exists()).toBe(true)
      expect(getProfilePicture().attributes('src')).toBe(mockObjectUrl)
      expect(getProfilePicture().attributes('alt')).toBeTruthy()
    })

    BddTest().then('it should not display the default account icon', () => {
      expect(getDefaultAccountIcon().exists()).toBe(false)
    })
  })

  BddTest().when('the profile picture fails to load', () => {
    beforeEach(async () => {
      await mountWith(userWithPicture)
      await getProfilePicture().trigger('error')
    })

    BddTest().then('it should display the default account icon', () => {
      expect(getDefaultAccountIcon().exists()).toBe(true)
    })

    BddTest().then('it should hide the profile picture', () => {
      expect(getProfilePicture().exists()).toBe(false)
    })
  })

  BddTest().when('the component is unmounted with a profile picture', () => {
    beforeEach(async () => {
      await mountWith(userWithPicture)
    })

    BddTest().then('it should revoke the object URL', () => {
      wrapper.unmount()

      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockObjectUrl)
    })
  })
})
