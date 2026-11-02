import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { HandleStub, mandatoryNodeProps } from '@/common/utils/vue-flow/vue-flow-test'
import UserNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/UserNode/UserNode.vue'

const mockObjectUrl = 'blob:http://localhost/profile-picture'
const OriginalURL = URL

class MockURL extends OriginalURL {
  static createObjectURL = vi.fn(() => mockObjectUrl)
  static revokeObjectURL = vi.fn()
}

const mockProfile = ref(mockedProfileOverview)

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    profile: {
      data: mockProfile
    }
  })
}))

BddTest().given('a UserNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserNode>>

  const stubs = {
    Handle: HandleStub,
  }

  const mountWith = async () => {
    mockProfile.value = {
      ...mockedProfileOverview,
      profilePicture: { ...mockedProfileOverview.profilePicture, id: 'TEST_ID' }
    }
    wrapper = mountComponent(UserNode, { props: mandatoryNodeProps, global: { stubs } })
    await flushPromises()
  }

  const getHandles = () => wrapper.findAllComponents(HandleStub)
  const getProfilePicture = () => wrapper.find('img')

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      vi.stubGlobal('URL', MockURL)
      await mountWith()
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    BddTest().then('it should render the profile picture of the connected user', () => {
      expect(getProfilePicture().exists()).toBe(true)
      expect(getProfilePicture().attributes('src')).toBe(mockObjectUrl)
    })

    BddTest().then('it should render the handles', () => {
      expect(getHandles()).toHaveLength(4)
    })
  })
})
