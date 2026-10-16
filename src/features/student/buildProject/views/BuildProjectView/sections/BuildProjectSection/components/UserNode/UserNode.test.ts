import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { HandleStub, mandatoryNodeProps } from '@/common/utils/vue-flow/vue-flow-test'
import UserNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/UserNode/UserNode.vue'

const LOCALHOST_PICTURE_URL = 'http://localhost:5173/src/assets/profile_picture_placeholder.png'
const QUALIF_PICTURE_URL = 'https://qualif.avenirs-esr.fr/src/assets/profile_picture_placeholder.png'

const mockProfile = ref(mockedProfileOverview)

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    profile: mockProfile
  })
}))

BddTest().given('a UserNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserNode>>

  const stubs = {
    Handle: HandleStub,
  }

  const mountWith = ({ profilePictureUrl = mockedProfileOverview.profilePicture.url }: { profilePictureUrl?: string } = {}) => {
    mockProfile.value = {
      ...mockedProfileOverview,
      profilePicture: { ...mockedProfileOverview.profilePicture, url: profilePictureUrl }
    }

    wrapper = mountComponent(UserNode, { props: mandatoryNodeProps, global: { stubs } })
  }

  const getHandles = () => wrapper.findAllComponents(HandleStub)
  const getProfilePicture = () => wrapper.find('img')

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the profile picture of the connected user', () => {
      expect(getProfilePicture().exists()).toBe(true)
      expect(getProfilePicture().attributes('src')).toBe(mockedProfileOverview.profilePicture.url)
    })

    BddTest().then('it should render the handles', () => {
      expect(getHandles()).toHaveLength(4)
    })
  })

  BddTest().when('the profile picture is served from localhost', () => {
    beforeEach(() => {
      mountWith({ profilePictureUrl: LOCALHOST_PICTURE_URL })
    })

    BddTest().then('it should point the picture to the qualif server', () => {
      expect(getProfilePicture().attributes('src')).toBe(QUALIF_PICTURE_URL)
    })
  })
})
