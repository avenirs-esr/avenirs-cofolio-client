import type { VueWrapper } from '@vue/test-utils'
import { AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { ICONS } from '@/common/constants'
import UserProgramsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserProgramsSection/UserProgramsSection.vue'

BddTest().given('a user programs section', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserProgramsSection>>

  const mountWith = async () => {
    wrapper = mount(UserProgramsSection, {
      props: { user: mockExternalUserDetail },
      global: { stubs: { AvIconText: AvIconTextStub, } },
    })
  }

  const getAvIconText = () => wrapper.findComponent(AvIconTextStub)

  BddTest().when('the section is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it displays its title', () => {
      expect(getAvIconText().exists()).toBe(true)
      expect(getAvIconText().props('text')).toBe('Formations')
      expect(getAvIconText().props('icon')).toBe(ICONS.PROGRAMS)
    })
  })
})
