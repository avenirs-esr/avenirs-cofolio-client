import type { VueWrapper } from '@vue/test-utils'
import { InputStub } from '#shared/ui/components/interactions/inputs/Input/Input.stub'
import ToolDescriptionTextarea from '#shared/ui/components/interactions/inputs/ToolDescriptionTextarea/ToolDescriptionTextarea.vue'
import { TOOL_DESCRIPTION_MAX_LENGTH } from '#shared/utils/tool.config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a tool description textarea', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolDescriptionTextarea>>

  const stubs = { Input: InputStub }

  const getInput = () => wrapper.findComponent(InputStub)

  BddTest().when('the textarea is mounted with default props', () => {
    beforeEach(() => {
      wrapper = mount(ToolDescriptionTextarea, { props: { modelValue: 'Une description' }, global: { stubs } })
    })

    BddTest().then('it should render a full width labelled textarea limited to the tool description max length', () => {
      expect(getInput().props()).toMatchObject({
        modelValue: 'Une description',
        label: 'Description de l\'outil',
        labelVisible: true,
        placeholder: 'Décrire l\'outil',
        maxlength: TOOL_DESCRIPTION_MAX_LENGTH,
        isTextarea: true,
        textareaMinHeight: '14rem',
      })
      expect(getInput().attributes('width')).toBe('100%')
    })

    BddTest().and('the value changes', () => {
      beforeEach(async () => {
        await getInput().vm.$emit('update:modelValue', 'Nouvelle description')
      })

      BddTest().then('it should update the model value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([['Nouvelle description']])
      })
    })
  })

  BddTest().when('the textarea is disabled', () => {
    beforeEach(() => {
      wrapper = mount(ToolDescriptionTextarea, { props: { modelValue: 'Une description', disabled: true }, global: { stubs } })
    })

    BddTest().then('it should render a disabled textarea without length limit', () => {
      expect(getInput().props('disabled')).toBe(true)
      expect(getInput().props('maxlength')).toBeUndefined()
    })
  })
})
