import type { NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { NodeTemplateStub } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.stub'
import TitleDescriptionNodeTemplate from '@/common/components/VueFlow/TitleDescriptionNodeTemplate/TitleDescriptionNodeTemplate.vue'
import { mandatoryNodeTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a handles component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TitleDescriptionNodeTemplate>>

  const stubs = {
    NodeTemplate: NodeTemplateStub,
  }

  BddTest().when('the component is mounted with empty data and default slot', () => {
    const props: NodeTemplateProps = {
      ...mandatoryNodeTemplateProps,
      data: {}
    }

    const slots = {
      default: '<div>Node Content</div>'
    }

    beforeEach(() => {
      wrapper = mount(TitleDescriptionNodeTemplate, { props, slots, global: { stubs } })
    })

    BddTest().then('it should only render the default slot', () => {
      expect(wrapper.text()).toContain('Node Content')
      expect(wrapper.text()).not.toContain('Title:')
      expect(wrapper.text()).not.toContain('Description:')
    })
  })

  BddTest().when('the component is mounted with full data', () => {
    const props: NodeTemplateProps = {
      ...mandatoryNodeTemplateProps,
      data: {
        title: 'Node Title',
        description: 'Node Description',
      }
    }

    beforeEach(() => {
      wrapper = mount(TitleDescriptionNodeTemplate, { props, global: { stubs } })
    })

    BddTest().then('it should render the title and description', () => {
      expect(wrapper.text()).toContain('Node Title')
      expect(wrapper.text()).toContain('Node Description')
    })
  })
})
