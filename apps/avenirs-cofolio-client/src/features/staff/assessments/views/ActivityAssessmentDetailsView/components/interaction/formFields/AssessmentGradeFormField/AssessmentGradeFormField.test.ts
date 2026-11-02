import type { VueWrapper } from '@vue/test-utils'
import type { WriteAssessmentFormData } from '@/features/staff/assessments/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import AssessmentGradeFormField from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/interaction/formFields/AssessmentGradeFormField/AssessmentGradeFormField.vue'

const MAX_GRADE = 20
const LABEL = 'Note'

function createTestWrapper (defaultGrade: number | null = null, readonly = false) {
  return createFormFieldTestWrapper<WriteAssessmentFormData, 'grade'>({
    formFieldComponent: AssessmentGradeFormField,
    fieldName: 'grade',
    defaultValue: defaultGrade,
    extraProps: { maxGrade: MAX_GRADE, readonly }
  })
}

BddTest().given('an assessment grade form field', () => {
  let wrapper: VueWrapper<InstanceType<ReturnType<typeof createTestWrapper>>>

  const stubs = {
    Input: InputStub
  }

  const mountField = (defaultGrade: number | null = null, readonly = false) => {
    wrapper = mount(createTestWrapper(defaultGrade, readonly), { global: { stubs } })
  }

  const getInput = () => wrapper.findComponent(InputStub)
  const getGaugeFill = () => wrapper.find('[data-testid="assessment-grade-gauge-fill"]')
  const getFormGrade = () => wrapper.vm.form.state.values.grade

  const typeGrade = async (value: string) => {
    getInput().vm.$emit('update:modelValue', value)
    await flushPromises()
  }

  BddTest().when('the component is mounted without a grade', () => {
    beforeEach(() => {
      mountField()
    })

    BddTest().then('it should render a required number input with its label', () => {
      const input = getInput()
      expect(input.props('label')).toBe(LABEL)
      expect(input.props('required')).toBeDefined()
      expect(input.props('min')).toBe(0)
      expect(input.props('max')).toBe(MAX_GRADE)
      expect(input.props('modelValue')).toBeNull()
      expect(input.attributes('type')).toBe('number')
    })

    BddTest().then('it should display the grading scale', () => {
      expect(wrapper.find('[data-testid="assessment-grade-scale"]').text()).toBe(`/\u00A0${MAX_GRADE}`)
    })

    BddTest().then('it should render an empty gauge', () => {
      expect(getGaugeFill().attributes('style')).toContain('width: 0%')
    })

    BddTest().and('a passing grade is typed', () => {
      beforeEach(async () => {
        await typeGrade('15')
      })

      BddTest().then('it should update the form value with a number', () => {
        expect(getFormGrade()).toBe(15)
      })

      BddTest().then('it should fill the gauge proportionally with the passing color', () => {
        expect(getGaugeFill().attributes('style')).toContain('width: 75%')
        expect(getGaugeFill().classes()).toContain('grade-gauge__fill--passing')
      })
    })

    BddTest().and('a failing grade is typed', () => {
      beforeEach(async () => {
        await typeGrade('5')
      })

      BddTest().then('it should fill the gauge without the passing color', () => {
        expect(getGaugeFill().attributes('style')).toContain('width: 25%')
        expect(getGaugeFill().classes()).not.toContain('grade-gauge__fill--passing')
      })
    })

    BddTest().and('a grade above the grading scale is typed', () => {
      beforeEach(async () => {
        await typeGrade('30')
      })

      BddTest().then('it should not overflow the gauge', () => {
        expect(getGaugeFill().attributes('style')).toContain('width: 100%')
      })
    })
  })

  BddTest().when('the component is mounted with a grade that is then erased', () => {
    beforeEach(async () => {
      mountField(12)
      await typeGrade('')
    })

    BddTest().then('it should reset the form value to null', () => {
      expect(getFormGrade()).toBeNull()
    })
  })

  BddTest().when('the component is mounted as readonly', () => {
    beforeEach(() => {
      mountField(null, true)
    })

    BddTest().then('it should disable the input', () => {
      expect(getInput().props('disabled')).toBe(true)
    })
  })
})
