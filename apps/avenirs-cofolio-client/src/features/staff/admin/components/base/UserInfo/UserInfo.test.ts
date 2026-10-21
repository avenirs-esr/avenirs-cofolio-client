import type { VueWrapper } from '@vue/test-utils'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import UserInfo from '@/features/staff/admin/components/base/UserInfo/UserInfo.vue'

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
  }

  const mountWith = async (user: UserInfoType = userWithoutPicture) => {
    wrapper = mountComponent(UserInfo, {
      props: { user },
      global: { stubs },
    })

    await flushPromises()
  }

  const getName = () => wrapper.find('[data-testid="name"]')
  const getEmail = () => wrapper.find('[data-testid="email"]')
  const getProfilePicture = () => wrapper.find('[data-testid="profile-picture"]')
  const getDefaultAccountIcon = () => wrapper.find('[data-testid="default-account-icon"]')

  beforeEach(() => {
    vi.stubGlobal('URL', MockURL)
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
