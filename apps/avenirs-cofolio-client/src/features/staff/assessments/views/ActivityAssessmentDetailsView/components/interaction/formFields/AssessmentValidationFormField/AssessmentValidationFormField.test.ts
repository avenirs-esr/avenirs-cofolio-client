import type { VueWrapper } from '@vue/test-utils'
import type { WriteAssessmentFormData } from '@/features/staff/assessments/types/forms.types'
import { AvIconTextStub, AvRadioButtonSetStub, AvRadioButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { WriteAssessmentFormDataValidationOption } from '@/features/staff/assessments/types/forms.types'
import AssessmentValidationFormField from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/interaction/formFields/AssessmentValidationFormField/AssessmentValidationFormField.vue'

const LEGEND = 'Validation de l\'activité'
const VALIDATED_LABEL = 'Validée'
const NOT_VALIDATED_LABEL = 'Non validée'

function createTestWrapper (defaultValidation: boolean | null = null, readonly = false) {
  return createFormFieldTestWrapper<WriteAssessmentFormData, 'validation'>({
    formFieldComponent: AssessmentValidationFormField,
    fieldName: 'validation',
    defaultValue: defaultValidation,
    extraProps: { readonly }
  })
}

BddTest().given('an assessment validation form field', () => {
  let wrapper: VueWrapper<InstanceType<ReturnType<typeof createTestWrapper>>>

  const stubs = {
    AvRadioButtonSet: AvRadioButtonSetStub,
    AvRadioButton: AvRadioButtonStub,
    AvIconText: AvIconTextStub
  }

  const mountField = (defaultValidation: boolean | null = null, readonly = false) => {
    wrapper = mount(createTestWrapper(defaultValidation, readonly), { global: { stubs } })
  }

  const getRadioSet = () => wrapper.findComponent(AvRadioButtonSetStub)
  const getOptions = () => wrapper.findAllComponents(AvRadioButtonStub)
  const getFormValidation = () => wrapper.vm.form.state.values.validation

  const selectOption = async (value: string | undefined) => {
    getRadioSet().vm.$emit('update:modelValue', value)
    await flushPromises()
  }

  BddTest().when('the component is mounted without a choice', () => {
    beforeEach(() => {
      mountField()
    })

    BddTest().then('it should render a required radio set without any selection', () => {
      const radioSet = getRadioSet()
      expect(radioSet.attributes('legend')).toBe(LEGEND)
      expect(radioSet.attributes('required')).toBeDefined()
      expect(radioSet.props('modelValue')).toBeUndefined()
    })

    BddTest().then('it should render the validated then the not validated options', () => {
      const labels = wrapper.findAllComponents(AvIconTextStub).map(iconText => iconText.props('text'))
      expect(getOptions().map(option => option.props('value'))).toEqual([
        WriteAssessmentFormDataValidationOption.VALIDATED,
        WriteAssessmentFormDataValidationOption.NOT_VALIDATED
      ])
      expect(labels).toEqual([VALIDATED_LABEL, NOT_VALIDATED_LABEL])
    })

    BddTest().and('the validated option is selected', () => {
      beforeEach(async () => {
        await selectOption(WriteAssessmentFormDataValidationOption.VALIDATED)
      })

      BddTest().then('it should set the validation to true', () => {
        expect(getFormValidation()).toBe(true)
        expect(getRadioSet().props('modelValue')).toBe(WriteAssessmentFormDataValidationOption.VALIDATED)
      })
    })

    BddTest().and('the not validated option is selected', () => {
      beforeEach(async () => {
        await selectOption(WriteAssessmentFormDataValidationOption.NOT_VALIDATED)
      })

      BddTest().then('it should set the validation to false', () => {
        expect(getFormValidation()).toBe(false)
        expect(getRadioSet().props('modelValue')).toBe(WriteAssessmentFormDataValidationOption.NOT_VALIDATED)
      })
    })

    BddTest().and('an unknown option is emitted', () => {
      beforeEach(async () => {
        await selectOption('unknown')
      })

      BddTest().then('it should keep the validation empty', () => {
        expect(getFormValidation()).toBeNull()
      })
    })
  })

  BddTest().when('the component is mounted with a validation', () => {
    beforeEach(() => {
      mountField(false)
    })

    BddTest().then('it should select the matching option', () => {
      expect(getRadioSet().props('modelValue')).toBe(WriteAssessmentFormDataValidationOption.NOT_VALIDATED)
    })
  })

  BddTest().when('the component is mounted as readonly', () => {
    beforeEach(() => {
      mountField(null, true)
    })

    BddTest().then('it should disable the radio set', () => {
      expect(getRadioSet().props('disabled')).toBe(true)
    })
  })
})
