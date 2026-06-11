import type { VueWrapper } from '@vue/test-utils'
import { UpdateProfileDrawerStub } from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.stub'
import { ProfileCardStub } from '@/common/components/ProfileCard/ProfileCard.stub'
import StaffHomeView from '@/features/staff/global/views/StaffHomeView/StaffHomeView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a staff home view', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffHomeView>>

  const stubs = {
    ProfileCard: ProfileCardStub,
    UpdateProfileDrawer: UpdateProfileDrawerStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(StaffHomeView, { global: { stubs } })
    })

    BddTest().then('it should render the ProfileCard component', async () => {
      await vi.waitFor(() => {
        const profileCard = wrapper.findComponent(ProfileCardStub)
        expect(profileCard.exists()).toBe(true)
      })
    })

    BddTest().then('it should render the update profile button', async () => {
      await vi.waitFor(() => {
        const updateProfileButton = wrapper.find('[data-testid="edit-profile-button"]')
        expect(updateProfileButton.exists()).toBe(true)
      })
    })

    BddTest().then('it should display the update profile drawer', async () => {
      await vi.waitFor(() => {
        const updateProfileDrawer = wrapper.findComponent(UpdateProfileDrawerStub)
        expect(updateProfileDrawer.exists()).toBe(true)
      })
    })
  })
})
