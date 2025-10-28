import type { UpdateAdditionalSkillForm } from '@/features/student/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import type { VueWrapper } from '@vue/test-utils'
import AdditionalSkillCommentFormField
  from '@/features/student/views/StudentUpdateAdditionalSkillView/components/AdditionalSkillCommentFormField/AdditionalSkillCommentFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: { AdditionalSkillCommentFormField },
  setup () {
    const form = useForm({
      defaultValues: { comment: '' },
      validators: {
        onSubmit () {
          return { fields: { comment: undefined } }
        }
      }
    }) as unknown as UpdateAdditionalSkillForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <AdditionalSkillCommentFormField :form="form" />
    </form>
  `
}

BddTest().given('an additional skill comment form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    AvInput: {
      name: 'AvInput',
      props: {
        id: { type: String, default: '' },
        modelValue: { type: String, default: '' },
        label: { type: String, default: '' },
        labelClass: { type: String, default: '' },
        errorMessage: { type: String, default: '' },
        maxlength: { type: Number, default: 0 },
        isTextarea: { type: Boolean, default: false },
      },
      emits: ['blur', 'update:modelValue'],
      template: `
        <div class="av-input-stub">
          <textarea
            v-if="isTextarea"
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

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the comment textarea', () => {
      const avInput = wrapper.findComponent({ name: 'AvInput' })
      expect(avInput.exists()).toBe(true)
      const textarea = avInput.find('textarea')
      expect(textarea.exists()).toBe(true)
    })

    BddTest().then('it should have the correct id', () => {
      const avInput = wrapper.findComponent({ name: 'AvInput' })
      expect(avInput.props('id')).toBe('skill-comment')
    })

    BddTest().then('it should be a textarea', () => {
      const avInput = wrapper.findComponent({ name: 'AvInput' })
      expect(avInput.props('isTextarea')).toBe(true)
    })

    BddTest().then('it should have maxlength of 400', () => {
      const avInput = wrapper.findComponent({ name: 'AvInput' })
      expect(avInput.props('maxlength')).toBe(400)
    })

    BddTest().then('it should have empty initial value', () => {
      const avInput = wrapper.findComponent({ name: 'AvInput' })
      expect(avInput.props('modelValue')).toBe('')
    })
  })

  BddTest().when('the user types in the textarea', () => {
    BddTest().then('it should update the form field value', async () => {
      const avInput = wrapper.findComponent({ name: 'AvInput' })
      const textarea = avInput.find('textarea')

      await textarea.setValue('My skill comment')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'AvInput' })
        expect(updated.props('modelValue')).toBe('My skill comment')
      })
    })
  })

  BddTest().when('the user blurs the textarea', () => {
    BddTest().then('it should trigger blur handler', async () => {
      const avInput = wrapper.findComponent({ name: 'AvInput' })
      const textarea = avInput.find('textarea')

      await textarea.trigger('blur')
      await wrapper.vm.$nextTick()

      expect(avInput.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().when('the user types a long comment', () => {
    BddTest().then('it should respect the maxlength (display truncated to 400)', async () => {
      const avInput = wrapper.findComponent({ name: 'AvInput' })
      const textarea = avInput.find('textarea')

      await textarea.setValue('a'.repeat(500))
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'AvInput' })
        const displayed = updated.props('modelValue') as string
        expect(displayed.length).toBeLessThanOrEqual(400)
      })
    })
  })

  BddTest().when('the form is submitted', () => {
    BddTest().then('it should not show validation error', async () => {
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const avInput = wrapper.findComponent({ name: 'AvInput' })
        expect(avInput.props('errorMessage')).toBeFalsy()
      })
    })
  })
})
