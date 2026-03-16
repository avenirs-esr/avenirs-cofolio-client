import type { RichTextEditorProps } from '@/common/components/interaction/inputs/RichTextEditor/RichTextEditor.vue'
import RichTextEditor from '@/common/components/interaction/inputs/RichTextEditor/RichTextEditor.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'

const AvRichTextEditorStub = defineComponent({
  name: 'AvRichTextEditor',
  props: ['modelValue', 'charCount', 'maxlength'],
  template: `<div class="av-rich-text-editor">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value); $emit('update:charCount', $event.target.value.length)"
    />
    <span data-test="char-count">{{ charCount }}</span>
  </div>`
})

BddTest().given('a rich text editor', () => {
  let wrapper: VueWrapper<InstanceType<typeof RichTextEditor>>

  const stubs = { AvRichTextEditor: AvRichTextEditorStub }

  BddTest().when('the component is mounted with maxlength', () => {
    const props: RichTextEditorProps = { maxlength: 100 }

    beforeEach(() => {
      wrapper = mount(RichTextEditor, { props, global: { stubs } })
    })

    BddTest().then('it should render an AvRichTextEditor with correct props', () => {
      expect(wrapper.findComponent(AvRichTextEditorStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvRichTextEditorStub).props()).toMatchObject({
        modelValue: undefined,
        charCount: undefined,
        maxlength: 100,
      })
    })

    BddTest().then('it should update char count on input', async () => {
      const input = wrapper.find('input')
      await input.setValue('Hello, world!')
      expect(wrapper.find('[data-test="char-count"]').text()).toBe('13')
    })
  })

  BddTest().when('the component is mounted without maxlength', () => {
    beforeEach(() => {
      wrapper = mount(RichTextEditor, { global: { stubs } })
    })

    BddTest().then('it should render an AvRichTextEditor with correct props', () => {
      expect(wrapper.findComponent(AvRichTextEditorStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvRichTextEditorStub).props()).toMatchObject({
        modelValue: undefined,
        charCount: undefined,
        maxlength: undefined,
      })
    })

    BddTest().then('it should update char count on input', async () => {
      const input = wrapper.find('input')
      await input.setValue('Hello, world!')
      expect(wrapper.find('[data-test="char-count"]').text()).toBe('13')
    })
  })
})
