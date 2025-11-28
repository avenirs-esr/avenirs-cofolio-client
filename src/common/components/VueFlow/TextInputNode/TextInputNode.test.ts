import type { NodeTemplateProps } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.vue'
import { NodeTemplateStub } from '@/common/components/VueFlow/NodeTemplate/NodeTemplate.stub'
import TextInputNode from '@/common/components/VueFlow/TextInputNode/TextInputNode.vue'
import { mandatoryNodeTemplateProps } from '@/common/utils/vue-flow/vue-flow-test'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach } from 'vitest'

const AvInputStub = defineComponent({
  name: 'AvInput',
  props: {
    modelValue: String,
    label: String,
    labelClass: String,
    placeholder: String,
    isValid: Boolean,
    isTextarea: Boolean,
    labelVisible: Boolean,
    disabled: Boolean,
    required: Boolean,
    maxlength: Number,
    minlength: Number,
    errorMessage: String,
    validMessage: String,
    prefixIcon: String,
    id: String,
    descriptionId: String,
    hint: String,
    type: String,
    minDate: String,
    maxDate: String,
    width: String,
    noRadius: Boolean,
    modelModifiers: Object,
    textareaMinHeight: String,
    row: [String, Number],
  },
  emits: ['update:modelValue', 'mousedown', 'touchstart', 'wheel'],
  template: '<input @input="$emit(\'update:modelValue\', $event.target.value)" data-testid="av-input-stub" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :required="required" :maxlength="maxlength" /><slot name="customCaptions" :current-value="modelValue" />'
})

BddTest().given('a TextInputNode component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TextInputNode>>
  const stubs = {
    AvInput: AvInputStub,
    NodeTemplate: NodeTemplateStub
  }

  BddTest().when('the component is mounted', () => {
    const props: NodeTemplateProps = { ...mandatoryNodeTemplateProps }

    beforeEach(() => {
      wrapper = mount(TextInputNode, { props, global: { stubs } })
    })

    BddTest().then('it should render the NodeTemplate component', () => {
      const nodeTemplate = wrapper.findComponent(NodeTemplateStub)
      expect(nodeTemplate.exists()).toBe(true)
    })

    BddTest().then('it should render two inputs', () => {
      const inputs = wrapper.findAllComponents(AvInputStub)
      expect(inputs.length).toBe(2)
    })
  })
})
