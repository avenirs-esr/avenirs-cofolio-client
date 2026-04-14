import type { VueWrapper } from '@vue/test-utils'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { getProfileErrorHandler } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { server } from '@/__mocks__/msw/server'
import { UpdateProfileDrawerStub } from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.stub'
import { ProfileCardStub } from '@/common/components/ProfileCard/ProfileCard.stub'
import StudentOverviewWidget from '@/features/student/user/components/cards/StudentOverviewWidget/StudentOverviewWidget.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student overview widget', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentOverviewWidget>>

  const stubs = {
    ProfileCard: ProfileCardStub,
    UpdateProfileDrawer: UpdateProfileDrawerStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(StudentOverviewWidget, {
        global: { stubs }
      })
      await vi.waitFor(() => {
        const profileCard = wrapper.findComponent({ name: 'ProfileCard' })
        expect(profileCard.exists()).toBe(true)
      })
    })

    BddTest().then('it should render the ProfileCard component', () => {
      const profileCard = wrapper.findComponent({ name: 'ProfileCard' })
      expect(profileCard.exists()).toBe(true)
    })

    BddTest().then('it should pass correct props to ProfileCard', () => {
      const profileCard = wrapper.findComponent({ name: 'ProfileCard' })
      expect(profileCard.props('firstName')).toBe(mockedProfileOverview.firstname)
      expect(profileCard.props('lastName')).toBe(mockedProfileOverview.lastname)
      expect(profileCard.props('profilePictureUrl')).toBe(mockedProfileOverview.profilePicture.url)
      expect(profileCard.props('coverPictureUrl')).toBe(mockedProfileOverview.coverPicture.url)
      expect(profileCard.props('bio')).toBe(mockedProfileOverview.bio)
    })

    BddTest().then('it should render 4 rich buttons in footer', () => {
      expect(wrapper.findAllComponents({ name: 'AvRichButton' })).toHaveLength(4)
    })

    BddTest().then('it should emit click on AvRichButtons', async () => {
      const editProfileButton = wrapper.findComponent('.av-rich-button--edit-profile')
      const shareResumeButton = wrapper.findComponent('.av-rich-button--share-resume')
      const shareCofolio = wrapper.findComponent('.av-rich-button--share-cofolio')
      const establishmentsButton = wrapper.findComponent('.av-rich-button--establishments')

      expect(editProfileButton.exists()).toBe(true)
      expect(shareResumeButton.exists()).toBe(true)
      expect(shareCofolio.exists()).toBe(true)
      expect(establishmentsButton.exists()).toBe(true)

      await editProfileButton.trigger('click')
      await shareResumeButton.trigger('click')
      await shareCofolio.trigger('click')
      await establishmentsButton.trigger('click')
    })

    BddTest().then('it should render UpdateProfileDrawer in hidden state', () => {
      const updateProfileDrawer = wrapper.findComponent({ name: 'UpdateProfileDrawer' })
      expect(updateProfileDrawer.exists()).toBe(true)
      expect(updateProfileDrawer.props('show')).toBe(false)
    })
  })

  BddTest().when('clicking on the edit profile button', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(StudentOverviewWidget, {
        global: { stubs }
      })
      await vi.waitFor(() => {
        const profileCard = wrapper.findComponent({ name: 'ProfileCard' })
        expect(profileCard.exists()).toBe(true)
      })
    })

    BddTest().then('it should show UpdateProfileDrawer', async () => {
      let updateProfileDrawer = wrapper.findComponent({ name: 'UpdateProfileDrawer' })
      expect(updateProfileDrawer.exists()).toBe(true)
      expect(updateProfileDrawer.props('show')).toBe(false)

      const editProfileButton = wrapper.findComponent('.av-rich-button--edit-profile')
      expect(editProfileButton.exists()).toBe(true)
      await editProfileButton.trigger('click')

      updateProfileDrawer = wrapper.findComponent({ name: 'UpdateProfileDrawer' })
      expect(updateProfileDrawer.exists()).toBe(true)
      expect(updateProfileDrawer.props('show')).toBe(true)
    })
  })

  BddTest().when('the component is mounted when studentSummary is undefined', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      server.use(getProfileErrorHandler)
      wrapper = mountComponent(StudentOverviewWidget, {
        global: { stubs }
      })
    })

    BddTest().then('it should render nothing', () => {
      expect(wrapper.find('[data-testid="student-overview-widget"]').exists()).toBe(false)
    })
  })
})
