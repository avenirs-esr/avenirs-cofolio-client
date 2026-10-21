import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedStaffProfileOverview } from '@/__mocks__/fixtures/staffs/user.fixtures'
import { ERole } from '@/api/avenir-esr'
import { ProfileCardStub } from '@/common/components/cards/ProfileCard/ProfileCard.stub'
import { UpdateProfileDrawerStub } from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.stub'
import { TutorialStub } from '@/common/components/overlay/tooltips/Tutorial/Tutorial.stub'
import { ActivitiesWidgetStub } from '@/features/staff/global/views/StaffHomeView/components/ActivitiesWidget/ActivitiesWidget.stub'
import { FeedbacksWidgetStub } from '@/features/staff/global/views/StaffHomeView/components/FeedbacksWidget/FeedbacksWidget.stub'
import StaffHomeView from '@/features/staff/global/views/StaffHomeView/StaffHomeView.vue'

const mockProfile = computed(() => mockedStaffProfileOverview)
const mockIsProfileLoading = ref(false)

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    roles: ref(Object.values(ERole)),
    profile: {
      isLoading: mockIsProfileLoading,
      data: mockProfile
    }
  })
}))

BddTest().given('a staff home view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffHomeView>>

  const stubs = {
    ProfileCard: ProfileCardStub,
    UpdateProfileDrawer: UpdateProfileDrawerStub,
    FeedbacksWidget: FeedbacksWidgetStub,
    ActivitiesWidget: ActivitiesWidgetStub,
    Tutorial: TutorialStub,
  }

  const mountWith = ({ isProfileLoading = false }: { isProfileLoading?: boolean } = {}) => {
    mockIsProfileLoading.value = isProfileLoading

    wrapper = mountComponent(StaffHomeView, { global: { stubs } })
  }

  const getActivitiesWidgets = () => wrapper.findAllComponents(ActivitiesWidgetStub)
  const getFeedbacksWidget = () => wrapper.findComponent(FeedbacksWidgetStub)
  const getProfileCard = () => wrapper.findComponent(ProfileCardStub)
  const getTutorial = () => wrapper.findComponent(TutorialStub)
  const getUpdateProfileButton = () => wrapper.find('[data-testid="edit-profile-button"]')
  const getUpdateProfileDrawer = () => wrapper.findComponent(UpdateProfileDrawerStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the ProfileCard component', () => {
      expect(getProfileCard().exists()).toBe(true)
    })

    BddTest().then('it should render the update profile button', () => {
      expect(getUpdateProfileButton().exists()).toBe(true)
    })

    BddTest().then('it should display the update profile drawer', () => {
      expect(getUpdateProfileDrawer().exists()).toBe(true)
    })

    BddTest().then('it should render the FeedbacksWidget component', () => {
      expect(getFeedbacksWidget().exists()).toBe(true)
    })

    BddTest().then('it should render two ActivitiesWidget components', () => {
      expect(getActivitiesWidgets()).toHaveLength(2)
    })

    BddTest().then('it should render the Tutorial component', () => {
      expect(getTutorial().exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted while the profile is still loading', () => {
    beforeEach(() => {
      mountWith({ isProfileLoading: true })
    })

    BddTest().then('it should not render the ProfileCard component nor its update button', () => {
      expect(getProfileCard().exists()).toBe(false)
      expect(getUpdateProfileButton().exists()).toBe(false)
    })

    BddTest().then('it should not render the update profile drawer', () => {
      expect(getUpdateProfileDrawer().exists()).toBe(false)
    })
  })
})
