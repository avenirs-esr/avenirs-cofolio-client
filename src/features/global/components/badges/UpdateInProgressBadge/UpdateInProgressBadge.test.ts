import UpdateInProgressBadge from '@/features/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('an UpdateInProgressBadge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof UpdateInProgressBadge>>
  const stubs = { AvBadge: AvBadgeStub }

  BddTest().when('the component is mounted and shown', () => {
    beforeEach(() => {
      wrapper = mount(UpdateInProgressBadge, { props: { show: true }, global: { stubs } })
    })

    BddTest().then('it should render the badge', () => {
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(true)
      expect(wrapper.text()).toContain('Modification en cours')
    })
  })

  BddTest().when('the component is mounted and hidden', () => {
    beforeEach(() => {
      wrapper = mount(UpdateInProgressBadge, { props: { show: false }, global: { stubs } })
    })

    BddTest().then('it should not render the badge', () => {
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(false)
      expect(wrapper.text()).not.toContain('Modification en cours')
    })
  })
})
