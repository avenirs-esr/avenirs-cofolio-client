import type { NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { TitleDescriptionNodeTemplateStub } from '@/common/components/VueFlow/TitleDescriptionNodeTemplate/TitleDescriptionNodeTemplate.stub'
import { mandatoryNodeTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import ResearchNode from '@/features/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/ResearchNode/ResearchNode.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach } from 'vitest'

BddTest().given('a ResearchNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ResearchNode>>

  const stubs = {
    TitleDescriptionNodeTemplate: TitleDescriptionNodeTemplateStub
  }

  BddTest().when('the component is mounted', () => {
    const props: NodeTemplateProps = { ...mandatoryNodeTemplateProps }

    beforeEach(() => {
      wrapper = mount(ResearchNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the TitleDescriptionNodeTemplate component', () => {
      const nodeTemplate = wrapper.findComponent(TitleDescriptionNodeTemplateStub)
      expect(nodeTemplate.exists()).toBe(true)
    })

    BddTest().then('the title in data should be undefined', () => {
      const nodeTemplate = wrapper.findComponent(TitleDescriptionNodeTemplateStub)
      expect(nodeTemplate.props('data').title).toBeUndefined()
    })

    BddTest().then('the description in data should be undefined', () => {
      const nodeTemplate = wrapper.findComponent(TitleDescriptionNodeTemplateStub)
      expect(nodeTemplate.props('data').description).toBeUndefined()
    })
  })

  BddTest().when('the component is mounted with a title and a description', () => {
    const initialTitle = 'Initial Title'
    const initialDescription = 'Initial Description'
    const props: NodeTemplateProps = {
      ...mandatoryNodeTemplateProps,
      data: {
        title: initialTitle,
        description: initialDescription
      }
    }

    beforeEach(() => {
      wrapper = mount(ResearchNode, { props, global: { stubs } })
    })

    BddTest().then('the title in data should be defined', () => {
      const nodeTemplate = wrapper.findComponent(TitleDescriptionNodeTemplateStub)
      expect(nodeTemplate.props('data').title).toBe(initialTitle)
    })

    BddTest().then('the description in data should be defined', () => {
      const nodeTemplate = wrapper.findComponent(TitleDescriptionNodeTemplateStub)
      expect(nodeTemplate.props('data').description).toBe(initialDescription)
    })
  })
})
