import type { NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { NodeTemplateStub } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.stub'
import { mandatoryNodeTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import MainSectionNode from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MainSectionNode/MainSectionNode.vue'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach } from 'vitest'

BddTest().given('a MainSectionNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof MainSectionNode>>
  const stubs = {
    AvInput: AvInputStub,
    NodeTemplate: NodeTemplateStub
  }

  BddTest().when('the component is mounted', () => {
    const props: NodeTemplateProps = { ...mandatoryNodeTemplateProps }

    beforeEach(() => {
      wrapper = mount(MainSectionNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the NodeTemplate component', () => {
      const nodeTemplate = wrapper.findComponent(NodeTemplateStub)
      expect(nodeTemplate.exists()).toBe(true)
    })

    BddTest().then('it should render an empty span', () => {
      const span = wrapper.find('span')
      expect(span.exists()).toBe(true)
      expect(span.text()).toBe('')
    })
  })

  BddTest().when('the component is mounted with a label', () => {
    const initialLabel = 'Initial Label'
    const props: NodeTemplateProps = {
      ...mandatoryNodeTemplateProps,
      data: {
        label: initialLabel
      }
    }

    beforeEach(() => {
      wrapper = mount(MainSectionNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the span with the initial label', () => {
      const span = wrapper.find('span')
      expect(span.exists()).toBe(true)
      expect(span.text()).toBe(initialLabel)
    })
  })
})
