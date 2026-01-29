import SelfKnowledgeElementDetailsContainer from '@/features/student/selfKnowledge/components/containers/SelfKnowledgeElementDetailsContainer/SelfKnowledgeElementDetailsContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a SelfKnowledgeElementDetailsContainer', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeElementDetailsContainer>>

  const elementTitle = 'Some element title'

  BddTest().when('the component is mounted with a title slot', () => {
    beforeEach(async () => {
      wrapper = mount(SelfKnowledgeElementDetailsContainer, {
        props: {
          elementTitle,
        },
        slots: {
          title: '<h2>Custom Title Slot</h2>',
        },
      })
    })

    BddTest().then('it should render the custom title slot', () => {
      expect(wrapper.text()).toContain('Custom Title Slot')
    })
  })

  BddTest().when('the component is mounted with a default slot', () => {
    beforeEach(async () => {
      wrapper = mount(SelfKnowledgeElementDetailsContainer, {
        props: {
          elementTitle,
        },
        slots: {
          default: '<div class="custom-default-slot">Custom Default Slot Content</div>',
        },
      })
    })

    BddTest().then('it should render the custom default slot content', () => {
      expect(wrapper.find('.custom-default-slot').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom Default Slot Content')
    })
  })
})
