import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { RichTextEditorStub } from '@avenirs-esr/shared'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import AlertMessageRichTextEditor from '@/features/global-alert/components/interactions/inputs/AlertMessageRichTextEditor/AlertMessageRichTextEditor.vue'

const LABEL = 'Contenu de l\'alerte'

BddTest().given('an AlertMessageRichTextEditor component', () => {
  let wrapper: VueWrapper<InstanceType<typeof AlertMessageRichTextEditor>>

  const stubs = {
    RichTextEditor: RichTextEditorStub,
  }

  const mountWith = (props: InstanceType<typeof AlertMessageRichTextEditor>['$props'] = {}) => {
    wrapper = mount(AlertMessageRichTextEditor, {
      props,
      global: { stubs }
    })
  }

  const getLabel = () => wrapper.find('[data-testid="alert-message-rich-text-editor-label"]')
  const getEditor = () => wrapper.findComponent(RichTextEditorStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the label', () => {
      expect(getLabel().text()).toBe(LABEL)
    })

    BddTest().then('it should configure the editor without headings', () => {
      expect(getEditor().props('allowedHeadersLevels')).toEqual([])
    })
  })

  BddTest().when('the component is mounted with an error message', () => {
    const errorMessage = 'Test'

    beforeEach(() => {
      mountWith({
        errorMessage
      })
    })

    BddTest().then('it should forward the error message to the editor', () => {
      expect(getEditor().props('errorMessage')).toBe(errorMessage)
    })
  })

  BddTest().when('the component is mounted with a model value', () => {
    const modelValue = '<p>Test</p>'

    beforeEach(() => {
      mountWith({
        modelValue
      })
    })

    BddTest().then('it should pass the model value to the editor', () => {
      expect(getEditor().props('modelValue')).toBe(modelValue)
    })
  })

  BddTest().when('the editor emits a new value', () => {
    const modelValue = '<p>Test</p>'

    beforeEach(async () => {
      mountWith()
      getEditor().vm.$emit('update:modelValue', modelValue)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit the new value', () => {
      expect(wrapper.emitted('update:modelValue')).toEqual([[modelValue]])
    })
  })
})
