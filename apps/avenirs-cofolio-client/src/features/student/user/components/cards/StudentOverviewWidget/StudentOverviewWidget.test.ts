import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { ProfileCardStub } from '@/common/components/cards/ProfileCard/ProfileCard.stub'
import { UpdateProfileDrawerStub } from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.stub'
import StudentOverviewWidget from '@/features/student/user/components/cards/StudentOverviewWidget/StudentOverviewWidget.vue'

const mockProfile = ref(mockedProfileOverview)
const mockIsProfileLoading = ref(false)

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    profile: {
      isLoading: mockIsProfileLoading,
      data: mockProfile
    }
  })
}))

BddTest().given('a learner overview widget', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentOverviewWidget>>

  const stubs = {
    ProfileCard: ProfileCardStub,
    UpdateProfileDrawer: UpdateProfileDrawerStub
  }

  const mountWith = ({ isProfileLoading = false }: { isProfileLoading?: boolean } = {}) => {
    mockIsProfileLoading.value = isProfileLoading

    wrapper = mountComponent(StudentOverviewWidget, { global: { stubs } })
  }

  const getEditProfileButton = () => wrapper.find('[data-testid="edit-profile-button"]')
  const getProfileCard = () => wrapper.findComponent(ProfileCardStub)
  const getRichButtons = () => wrapper.findAllComponents({ name: 'AvRichButton' })
  const getUpdateProfileDrawer = () => wrapper.findComponent(UpdateProfileDrawerStub)
  const getWidget = () => wrapper.find('[data-testid="student-overview-widget"]')

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the ProfileCard component', () => {
      expect(getProfileCard().exists()).toBe(true)
    })

    BddTest().then('it should pass correct props to ProfileCard', () => {
      const profileCard = getProfileCard()

      expect(profileCard.props('firstName')).toBe(mockedProfileOverview.firstname)
      expect(profileCard.props('lastName')).toBe(mockedProfileOverview.lastname)
      expect(profileCard.props('profilePictureUrl')).toBe(mockedProfileOverview.profilePicture.url)
      expect(profileCard.props('coverPictureUrl')).toBe(mockedProfileOverview.coverPicture.url)
      expect(profileCard.props('bio')).toBe(mockedProfileOverview.bio)
    })

    BddTest().then('it should render 1 rich button in footer', () => {
      expect(getRichButtons()).toHaveLength(1)
    })

    BddTest().then('it should emit click on AvRichButtons', async () => {
      expect(getEditProfileButton().exists()).toBe(true)

      await getEditProfileButton().trigger('click')
    })

    BddTest().then('it should render UpdateProfileDrawer in hidden state', () => {
      const updateProfileDrawer = getUpdateProfileDrawer()

      expect(updateProfileDrawer.exists()).toBe(true)
      expect(updateProfileDrawer.props('show')).toBe(false)
    })
  })

  BddTest().when('clicking on the edit profile button', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should show UpdateProfileDrawer', async () => {
      expect(getUpdateProfileDrawer().exists()).toBe(true)
      expect(getUpdateProfileDrawer().props('show')).toBe(false)

      await getEditProfileButton().trigger('click')

      expect(getUpdateProfileDrawer().exists()).toBe(true)
      expect(getUpdateProfileDrawer().props('show')).toBe(true)
    })
  })

  BddTest().when('the component is mounted while the profile is still loading', () => {
    beforeEach(() => {
      mountWith({ isProfileLoading: true })
    })

    BddTest().then('it should render nothing', () => {
      expect(getWidget().exists()).toBe(false)
      expect(getUpdateProfileDrawer().exists()).toBe(false)
    })
  })
})
