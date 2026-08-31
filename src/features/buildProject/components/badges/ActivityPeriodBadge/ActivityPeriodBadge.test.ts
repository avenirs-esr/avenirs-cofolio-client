import ActivityPeriodBadge from '@/features/buildProject/components/badges/ActivityPeriodBadge/ActivityPeriodBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('an activity period summary badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPeriodBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(ActivityPeriodBadge, { global: { stubs } })
    })

    BddTest().then('it should render the badge component', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.exists()).toBe(true)
    })
  })
})
