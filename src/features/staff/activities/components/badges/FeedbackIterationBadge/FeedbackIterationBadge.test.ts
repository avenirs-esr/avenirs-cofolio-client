import FeedbackIterationBadge from '@/features/staff/activities/components/badges/FeedbackIterationBadge/FeedbackIterationBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a FeedbackIterationBadge component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackIterationBadge>>
  const stubs = { AvBadge: AvBadgeStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(FeedbackIterationBadge, { props: { iteration: 1 }, global: { stubs } })
    })

    BddTest().then('it should render the badge', () => {
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(true)
      expect(wrapper.text()).toContain('Demande 1')
    })
  })

  BddTest().when('the component is mounted with max iterations', () => {
    beforeEach(() => {
      wrapper = mount(FeedbackIterationBadge, { props: { iteration: 1, maxIterations: 3 }, global: { stubs } })
    })

    BddTest().then('it should render the iteration out of max iterations', () => {
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(true)
      expect(wrapper.text()).toContain('Demande 1/3')
    })
  })
})
