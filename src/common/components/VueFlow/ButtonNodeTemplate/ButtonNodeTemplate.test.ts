import ButtonNodeTemplate, { type ButtonNodeTemplateProps } from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.vue'
import { NodeTemplateStub } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.stub'
import { mandatoryNodeButtonTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a button node template', () => {
  let wrapper: VueWrapper<InstanceType<typeof ButtonNodeTemplate>>

  const stubs = {
    AvButton: AvButtonStub,
    NodeTemplate: NodeTemplateStub,
  }

  BddTest().when('the component is mounted with given props', () => {
    const props: ButtonNodeTemplateProps = {
      ...mandatoryNodeButtonTemplateProps,
      id: `node-button-id`,
      type: 'custom-button',
      label: 'Button Node',
      icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE,
      small: true,
      position: {
        x: 10,
        y: 20,
      },
      data: {
        test: 'test-data',
        top: true,
        bottom: true,
      },
      parentNodeId: 'some-parent-id',
    }

    const slots = {
      default: '<div class="extra-content">Extra Content</div>',
      modal: '<div class="modal-content">Modal Content</div>'
    }

    beforeEach(() => {
      wrapper = mount(ButtonNodeTemplate, {
        props,
        global: { stubs },
        slots
      })
    })

    BddTest().then('it should render the NodeTemplate with correct props', () => {
      const nodeTemplate = wrapper.findComponent(NodeTemplateStub)
      expect(nodeTemplate.exists()).toBe(true)
      expect(nodeTemplate.props('id')).toBe(props.id)
      expect(nodeTemplate.props('type')).toBe(props.type)
      expect(nodeTemplate.props('data')).toStrictEqual(props.data)
      expect(nodeTemplate.props('collapsible')).toBe(false)
      expect(nodeTemplate.props('withoutDropdown')).toBe(true)
      expect(nodeTemplate.props('titleOnly')).toBe(true)
      expect(nodeTemplate.props('withProfileUpdate')).toBe(false)
    })

    BddTest().then('it should render the AvButton with correct props', () => {
      const avButton = wrapper.findComponent(AvButtonStub)
      expect(avButton.exists()).toBe(true)
      expect(avButton.props('label')).toBe(props.label)
      expect(avButton.props('icon')).toBe(props.icon)
      expect(avButton.props('small')).toBe(props.small)
    })

    BddTest().and('the button is clicked', () => {
      beforeEach(() => {
        wrapper.findComponent(AvButtonStub).vm.$emit('click')
      })

      BddTest().then('it should emit a click event', () => {
        expect(wrapper.emitted('click')).toBeTruthy()
      })
    })
  })
})
