import type { NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import LinkInputNode from '@/common/components/VueFlow/LinkInputNode/LinkInputNode.vue'
import { NodeTemplateStub } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.stub'
import { mandatoryNodeTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import { AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach } from 'vitest'

BddTest().given('a LinkInputNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof LinkInputNode>>
  const stubs = {
    AvInput: AvInputStub,
    NodeTemplate: NodeTemplateStub
  }

  BddTest().when('the component is mounted', () => {
    const props: NodeTemplateProps = { ...mandatoryNodeTemplateProps }

    beforeEach(() => {
      wrapper = mount(LinkInputNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the NodeTemplate component', () => {
      const nodeTemplate = wrapper.findComponent(NodeTemplateStub)
      expect(nodeTemplate.exists()).toBe(true)
    })

    BddTest().then('it should render an empty anchor', () => {
      const anchor = wrapper.find('a')
      expect(anchor.exists()).toBe(true)
      expect(anchor.attributes('href')).toBeUndefined()
      expect(anchor.text()).toBe('')
    })

    BddTest().and('the user inputs a link', () => {
      const testLink = 'https://example.com/trajectory-details'

      beforeEach(() => {
        const avInput = wrapper.findComponent(AvInputStub)
        avInput.vm.$emit('update:modelValue', testLink)
      })

      BddTest().then('it should update the anchor href and text', () => {
        const anchor = wrapper.find('a')
        expect(anchor.attributes('href')).toBe(testLink)
        expect(anchor.text()).toBe(testLink)
      })
    })
  })

  BddTest().when('the component is mounted with an initial link', () => {
    const initialLink = 'https://example.com/initial-link'
    const props: NodeTemplateProps = {
      ...mandatoryNodeTemplateProps,
      data: {
        link: initialLink
      }
    }

    beforeEach(() => {
      wrapper = mount(LinkInputNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the anchor with the initial link', () => {
      const anchor = wrapper.find('a')
      expect(anchor.exists()).toBe(true)
      expect(anchor.attributes('href')).toBe(initialLink)
      expect(anchor.text()).toBe(initialLink)
    })

    BddTest().and('the user changes the link', () => {
      const newLink = 'https://example.com/updated-link'

      beforeEach(() => {
        const avInput = wrapper.findComponent(AvInputStub)
        avInput.vm.$emit('update:modelValue', newLink)
      })

      BddTest().then('it should update the anchor href and text to the new link', () => {
        const anchor = wrapper.find('a')
        expect(anchor.attributes('href')).toBe(newLink)
        expect(anchor.text()).toBe(newLink)
      })
    })
  })
})
