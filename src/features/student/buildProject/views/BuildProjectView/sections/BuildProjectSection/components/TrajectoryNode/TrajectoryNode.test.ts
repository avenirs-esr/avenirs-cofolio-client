import type { NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { NodeTemplateStub } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.stub'
import { mandatoryNodeTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import TrajectoryNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/TrajectoryNode/TrajectoryNode.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach } from 'vitest'

BddTest().given('a TrajectoryNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TrajectoryNode>>
  const stubs = {
    AvIcon: AvIconStub,
    NodeTemplate: NodeTemplateStub
  }

  BddTest().when('the component is mounted', () => {
    const props: NodeTemplateProps = {
      ...mandatoryNodeTemplateProps,
      data: {
        title: 'Trajectory Title',
        subtitle: 'Trajectory Subtitle',
        description: 'Trajectory Description'
      }
    }

    beforeEach(() => {
      wrapper = mount(TrajectoryNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the NodeTemplate component', () => {
      const nodeTemplate = wrapper.findComponent(NodeTemplateStub)
      expect(nodeTemplate.exists()).toBe(true)
    })

    BddTest().then('it should render all texts', () => {
      expect(wrapper.text()).toContain(props.data.title)
      expect(wrapper.text()).toContain(props.data.subtitle)
      expect(wrapper.text()).toContain(props.data.description)
    })
  })
})
