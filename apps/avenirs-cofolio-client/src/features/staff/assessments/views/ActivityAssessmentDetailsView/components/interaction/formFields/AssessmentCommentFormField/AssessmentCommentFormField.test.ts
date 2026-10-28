import type { VueWrapper } from '@vue/test-utils'
import type { WriteAssessmentFormData } from '@/features/staff/assessments/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { ASSESSMENT_COMMENT_MAX_LENGTH } from '@/features/staff/assessments/config'
import AssessmentCommentFormField from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/interaction/formFields/AssessmentCommentFormField/AssessmentCommentFormField.vue'

const LABEL = 'Commentaire'

function createTestWrapper (required = false, readonly = false) {
  return createFormFieldTestWrapper<WriteAssessmentFormData, 'comment'>({
    formFieldComponent: AssessmentCommentFormField,
    fieldName: 'comment',
    defaultValue: '',
    extraProps: { required, readonly }
  })
}

BddTest().given('an assessment comment form field', () => {
  let wrapper: VueWrapper<InstanceType<ReturnType<typeof createTestWrapper>>>

  const stubs = {
    Input: InputStub
  }

  const mountField = (required = false, readonly = false) => {
    wrapper = mount(createTestWrapper(required, readonly), { global: { stubs } })
  }

  const getTextarea = () => wrapper.findComponent(InputStub)
  const getFormComment = () => wrapper.vm.form.state.values.comment

  BddTest().when('the component is mounted as optional', () => {
    beforeEach(() => {
      mountField()
    })

    BddTest().then('it should render an optional textarea limited to the comment max length', () => {
      const textarea = getTextarea()
      expect(textarea.props('label')).toBe(LABEL)
      expect(textarea.props('required')).toBe(false)
      expect(textarea.props('isTextarea')).toBeDefined()
      expect(textarea.props('maxlength')).toBe(ASSESSMENT_COMMENT_MAX_LENGTH)
      expect(textarea.props('modelValue')).toBe('')
    })

    BddTest().and('a comment is typed', () => {
      beforeEach(async () => {
        getTextarea().vm.$emit('update:modelValue', 'Bon travail')
        await flushPromises()
      })

      BddTest().then('it should update the form value', () => {
        expect(getFormComment()).toBe('Bon travail')
      })
    })

    BddTest().and('the textarea is emptied', () => {
      beforeEach(async () => {
        getTextarea().vm.$emit('update:modelValue', null)
        await flushPromises()
      })

      BddTest().then('it should set an empty comment', () => {
        expect(getFormComment()).toBe('')
      })
    })
  })

  BddTest().when('the component is mounted as required', () => {
    beforeEach(() => {
      mountField(true)
    })

    BddTest().then('it should render a required textarea', () => {
      expect(getTextarea().props('label')).toBe(LABEL)
      expect(getTextarea().props('required')).toBe(true)
    })
  })

  BddTest().when('the component is mounted as readonly', () => {
    beforeEach(() => {
      mountField(false, true)
    })

    BddTest().then('it should disable the textarea', () => {
      expect(getTextarea().props('disabled')).toBe(true)
    })
  })
})
