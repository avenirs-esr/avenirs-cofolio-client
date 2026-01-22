import type { AddDeclaredExperienceForm, DeclaredExperienceFormData } from '@/features/student/personalCareer/types/forms.types'
import DeclaredExperienceReviewFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceReviewFormField/DeclaredExperienceReviewFormField.vue'
import { DeclaredExperienceReviewTextareaStub } from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperienceReviewTextarea/DeclaredExperienceReviewTextarea.stub'
import { DECLARED_EXPERIENCE_REVIEW_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    DeclaredExperienceReviewFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        review: ''
      } as DeclaredExperienceFormData,
      validators: {
        onSubmit () {
          return { fields: { review: undefined } }
        }
      }
    }) as unknown as AddDeclaredExperienceForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredExperienceReviewFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared experience review form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    DeclaredExperienceReviewTextarea: DeclaredExperienceReviewTextareaStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(TestWrapper, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the review textarea component', () => {
      const textarea = wrapper.findComponent({ name: 'DeclaredExperienceReviewTextarea' })
      expect(textarea.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial value', () => {
      const textarea = wrapper.findComponent({ name: 'DeclaredExperienceReviewTextarea' })
      expect(textarea.props('modelValue')).toBe('')
    })

    BddTest().and('the user enters a review', () => {
      BddTest().then('it should update the form field value', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceReviewTextarea' })
        const textInput = textarea.find('textarea')
        await textInput.setValue('A positive review of my experience')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceReviewTextarea' })
          expect(updated.props('modelValue')).toBe('A positive review of my experience')
        })
      })
    })

    BddTest().and('the user enters a review exceeding max length', () => {
      BddTest().then('it should truncate the value to max length', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceReviewTextarea' })
        const textInput = textarea.find('textarea')
        const longReview = 'a'.repeat(DECLARED_EXPERIENCE_REVIEW_MAX_LENGTH + 10)
        await textInput.setValue(longReview)
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceReviewTextarea' })
          expect(updated.props('modelValue')).toHaveLength(DECLARED_EXPERIENCE_REVIEW_MAX_LENGTH)
        })
      })
    })

    BddTest().and('the textarea emits blur', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceReviewTextarea' })
        await textarea.vm.$emit('blur')
        await wrapper.vm.$nextTick()

        expect(textarea.emitted('blur')).toBeTruthy()
      })
    })

    BddTest().and('the form is submitted with empty review', () => {
      BddTest().then('it should not show validation error because it is optional', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const textarea = wrapper.findComponent({ name: 'DeclaredExperienceReviewTextarea' })
          expect(textarea.props('errorMessage')).toBeFalsy()
        })
      })
    })

    BddTest().and('the form is submitted with valid review', () => {
      BddTest().then('it should not show validation error', async () => {
        const textarea = wrapper.findComponent({ name: 'DeclaredExperienceReviewTextarea' })
        const textInput = textarea.find('textarea')
        await textInput.setValue('Valid review of the experience')
        await wrapper.vm.$nextTick()
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        await vi.waitFor(() => {
          const updated = wrapper.findComponent({ name: 'DeclaredExperienceReviewTextarea' })
          expect(updated.props('errorMessage')).toBeFalsy()
        })
      })
    })
  })
})
