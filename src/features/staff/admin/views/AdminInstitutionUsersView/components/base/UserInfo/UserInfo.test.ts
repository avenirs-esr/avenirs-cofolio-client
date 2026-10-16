import type { VueWrapper } from '@vue/test-utils'
import type { UserInfoProps } from '@/features/staff/admin/views/AdminInstitutionUsersView/components/base/UserInfo/UserInfo.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import UserInfo from '@/features/staff/admin/views/AdminInstitutionUsersView/components/base/UserInfo/UserInfo.vue'

BddTest().given('a user information component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserInfo>>

  const stubs = { AvIcon: AvIconStub }

  const mountWith = (props: UserInfoProps) => wrapper = mount(UserInfo, { props, global: { stubs } })
  const getName = () => wrapper.find('[data-testid="name"]')
  const getEmail = () => wrapper.find('[data-testid="email"]')
  const getProfilePicture = () => wrapper.find('[data-testid="profile-picture"]')
  const getDefaultAccountIcon = () => wrapper.find('[data-testid="default-account-icon"]')

  const defaultProps: UserInfoProps = {
    firstName: 'Alice',
    lastName: 'Dupont',
  }

  BddTest().when('the component is mounted with required props', () => {
    beforeEach(() => {
      mountWith(defaultProps)
    })

    BddTest().then('it should display the capitalized full name', () => {
      expect(getName().exists()).toBe(true)
      expect(getName().text()).toContain('Alice Dupont')
    })

    BddTest().then('it should not display the email address', () => {
      expect(getEmail().exists()).toBe(false)
    })

    BddTest().then('it should display the default account icon', () => {
      expect(getDefaultAccountIcon().exists()).toBe(true)
    })

    BddTest().then('it should not display the profile picture', () => {
      expect(getProfilePicture().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with all props', () => {
    const allProps: UserInfoProps = {
      ...defaultProps,
      email: 'alice.dupont@example.com',
      profilePictureUrl: 'https://example.com/profile.jpg',
    }

    beforeEach(() => {
      mountWith(allProps)
    })

    BddTest().then('it should display the email address', () => {
      expect(getEmail().exists()).toBe(true)
      expect(getEmail().text()).toContain('alice.dupont@example.com')
    })

    BddTest().then('it should display the profile picture', () => {
      expect(getProfilePicture().exists()).toBe(true)
    })

    BddTest().then('it should not display the default account icon', () => {
      expect(getDefaultAccountIcon().exists()).toBe(false)
    })
  })
})
