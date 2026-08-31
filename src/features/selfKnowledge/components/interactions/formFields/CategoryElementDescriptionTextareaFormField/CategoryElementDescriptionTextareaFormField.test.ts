import type { AddSelfKnowledgeCategoryElementForm } from '@/features/selfKnowledge/types/forms.types'
import CategoryElementDescriptionTextareaFormField
  from '@/features/selfKnowledge/components/interactions/formFields/CategoryElementDescriptionTextareaFormField/CategoryElementDescriptionTextareaFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    CategoryElementDescriptionTextareaFormField
  },
  setup () {
    const form = useForm({
      defaultValues: { title: '', description: '', rating: null },
      validators: {
        onSubmit () {
          return { fields: { description: undefined } }
        }
      }
    }) as unknown as AddSelfKnowledgeCategoryElementForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <CategoryElementDescriptionTextareaFormField :form="form" />
    </form>
  `
})

BddTest().given('a self knowledge category element description textarea form field component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    CategoryElementDescriptionTextarea: {
      name: 'CategoryElementDescriptionTextarea',
      props: {
        id: { type: String, default: '' },
        modelValue: { type: String, default: '' },
        errorMessage: { type: String, default: '' },
        maxlength: { type: Number, default: 0 }
      },
      emits: ['blur', 'update:modelValue'],
      template: `
        <div class="category-element-description-textarea-stub">
          <textarea
            :id="id"
            :value="modelValue"
            :maxlength="maxlength"
            @blur="$emit('blur')"
            @input="$emit('update:modelValue', $event.target.value)"
          />
          <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
        </div>
      `
    }
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the description textarea', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      expect(input.exists()).toBe(true)
      const textarea = input.find('textarea')
      expect(textarea.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      expect(input.props('id')).toBe('element-description')
    })

    BddTest().then('it should have empty initial value', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      expect(input.props('modelValue')).toBe('')
    })
  })

  BddTest().and('the user types in the textarea', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      const textarea = input.find('textarea')
      await textarea.setValue('My description text')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form field value', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
        expect(updated.props('modelValue')).toBe('My description text')
      })
    })
  })

  BddTest().and('the user blurs the textarea', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      const textarea = input.find('textarea')
      await textarea.trigger('blur')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should trigger blur handler', () => {
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      expect(input.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().and('the form is submitted', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not show validation error', async () => {
      await vi.waitFor(() => {
        const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
        expect(input.props('errorMessage')).toBeFalsy()
      })
    })
  })

  BddTest().and('the user provides a valid string value', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      const textarea = input.find('textarea')
      await textarea.setValue('Valid description')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the form state', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
        expect(updated.props('modelValue')).toBe('Valid description')
      })
    })
  })
})
