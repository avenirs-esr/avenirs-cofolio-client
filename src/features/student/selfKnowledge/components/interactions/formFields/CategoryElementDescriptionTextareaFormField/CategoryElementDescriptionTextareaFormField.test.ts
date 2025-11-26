import type { AddSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'
import CategoryElementDescriptionTextareaFormField
  from '@/features/student/selfKnowledge/components/interactions/formFields/CategoryElementDescriptionTextareaFormField/CategoryElementDescriptionTextareaFormField.vue'
import { CategoryElementDescriptionTextareaStub } from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementDescriptionTextarea/CategoryElementDescriptionTextarea.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
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
}

BddTest().given('a self knowledge category element description textarea form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    CategoryElementDescriptionTextarea: CategoryElementDescriptionTextareaStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
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

  BddTest().when('the user types in the textarea', () => {
    BddTest().then('it should update the form field value', async () => {
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      const textarea = input.find('textarea')

      await textarea.setValue('My description text')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
        expect(updated.props('modelValue')).toBe('My description text')
      })
    })
  })

  BddTest().when('the user blurs the textarea', () => {
    BddTest().then('it should trigger blur handler', async () => {
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      const textarea = input.find('textarea')

      await textarea.trigger('blur')
      await wrapper.vm.$nextTick()

      expect(input.emitted('blur')).toBeTruthy()
    })
  })

  BddTest().when('the user types a long description', () => {
    BddTest().then('it should respect the maxlength of 400', async () => {
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      const textarea = input.find('textarea')

      await textarea.setValue('a'.repeat(500))
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
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
        const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
        expect(input.props('errorMessage')).toBeFalsy()
      })
    })
  })

  BddTest().when('the user provides a valid string value', () => {
    BddTest().then('it should update the form state', async () => {
      const input = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
      const textarea = input.find('textarea')

      await textarea.setValue('Valid description')
      await wrapper.vm.$nextTick()

      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'CategoryElementDescriptionTextarea' })
        expect(updated.props('modelValue')).toBe('Valid description')
      })
    })
  })
})
