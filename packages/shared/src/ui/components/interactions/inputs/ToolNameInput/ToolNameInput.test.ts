import type { VueWrapper } from '@vue/test-utils'
import { InputStub } from '#shared/ui/components/interactions/inputs/Input/Input.stub'
import ToolNameInput from '#shared/ui/components/interactions/inputs/ToolNameInput/ToolNameInput.vue'
import { TOOL_NAME_MAX_LENGTH } from '#shared/utils/tool.config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a tool name input', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolNameInput>>

  const stubs = { Input: InputStub }

  const getInput = () => wrapper.findComponent(InputStub)

  BddTest().when('the input is mounted with default props', () => {
    beforeEach(() => {
      wrapper = mount(ToolNameInput, { props: { modelValue: 'Outil' }, global: { stubs } })
    })

    BddTest().then('it should render a full width labelled input limited to the tool name max length', () => {
      expect(getInput().props()).toMatchObject({
        modelValue: 'Outil',
        label: 'Nom de l\'outil',
        labelVisible: true,
        placeholder: 'Saisir le nom de l\'outil',
        maxlength: TOOL_NAME_MAX_LENGTH,
        isTextarea: false,
      })
      expect(getInput().attributes('width')).toBe('100%')
    })

    BddTest().and('the value changes', () => {
      beforeEach(async () => {
        await getInput().vm.$emit('update:modelValue', 'Nouvel outil')
      })

      BddTest().then('it should update the model value', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([['Nouvel outil']])
      })
    })
  })

  BddTest().when('the input is disabled', () => {
    beforeEach(() => {
      wrapper = mount(ToolNameInput, { props: { modelValue: 'Outil', disabled: true }, global: { stubs } })
    })

    BddTest().then('it should render a disabled input without length limit', () => {
      expect(getInput().props('disabled')).toBe(true)
      expect(getInput().props('maxlength')).toBeUndefined()
    })
  })
})
