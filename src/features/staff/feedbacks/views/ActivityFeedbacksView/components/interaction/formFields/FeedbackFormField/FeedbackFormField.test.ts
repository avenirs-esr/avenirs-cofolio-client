import type { VueWrapper } from '@vue/test-utils'
import FeedbackFormField from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/interaction/formFields/FeedbackFormField/FeedbackFormField.vue'
import { FeedbackTextareaStub } from '@/features/staff/feedbacks/views/ActivityFeedbacksView/components/interaction/inputs/FeedbackTextarea/FeedbackTextarea.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const TestHost = defineComponent({
  name: 'FeedbackFormFieldTestHost',
  components: { FeedbackFormField },
  setup () {
    const form = useForm({
      defaultValues: {
        feedback: ''
      }
    })

    return { form }
  },
  template: '<FeedbackFormField :form="form" />'
})

BddTest().given('a feedback form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestHost>>

  const stubs = {
    FeedbackTextarea: FeedbackTextareaStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(TestHost, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the feedback textarea component', () => {
      const textarea = wrapper.findComponent(FeedbackTextareaStub)
      expect(textarea.exists()).toBe(true)
    })

    BddTest().then('it should initialize textarea with an empty value', () => {
      const textarea = wrapper.findComponent(FeedbackTextareaStub)
      expect(textarea.props('modelValue')).toBe('')
    })
  })
})
