import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { ToggleStub } from '@/common/components/interaction/toggles/Toggle/Toggle.stub'
import ActivityAssessmentGradeFormField from '@/features/staff/activities/components/interactions/formFields/ActivityAssessmentGradeFormField/ActivityAssessmentGradeFormField.vue'
import { ACTIVITY_ASSESSMENT_GRADE_MAX_DECIMALS } from '@/features/staff/activities/config'

const DESCRIPTION = 'Permettre l\'attribution d\'une note selon un barème défini'
const HINT = `Note maximale pouvant être attribuée, supérieure à 0, jusqu'à ${ACTIVITY_ASSESSMENT_GRADE_MAX_DECIMALS} décimales.`
const LABEL = 'Barème maximal'

type MountingOptions = ComponentMountingOptions<typeof ActivityAssessmentGradeFormField>
type ComponentProps = Omit<MountingOptions['props'], 'form'>

function createTestWrapper (initialGrade: number | undefined, props: ComponentProps) {
  return createFormFieldTestWrapper<EditActivityFormData, 'assessmentGrade'>({
    formFieldComponent: ActivityAssessmentGradeFormField,
    fieldName: 'assessmentGrade',
    defaultValue: initialGrade,
    extraProps: props,
  })
}

BddTest().given('an ActivityAssessmentGradeFormField component', () => {
  let wrapper: VueWrapper<InstanceType<ReturnType<typeof createTestWrapper>>>

  const stubs = {
    Input: InputStub,
    Toggle: ToggleStub,
  }

  const mountWith = (initialGrade?: number, props: ComponentProps = {}) => {
    wrapper = mount(createTestWrapper(initialGrade, props), {
      global: { stubs },
    })
  }

  const getFormField = () => wrapper.findComponent(ActivityAssessmentGradeFormField)
  const getToggle = () => wrapper.findComponent(ToggleStub)
  const getGradeInput = () => wrapper.findComponent(InputStub) as VueWrapper<InstanceType<typeof InputStub>>
  const getGradeInputDOM = () => getGradeInput().find('input')

  const getGrade = () => wrapper.vm.form.getFieldValue('assessmentGrade')
  const getGradeStep = () => getGradeInput().vm.$attrs.step
  const getChanges = () => getFormField().emitted('change')
  const getGradeEnabledUpdates = () => getFormField().emitted('updateGradeEnabled')

  const expectGradeError = async (expected: boolean = true) => {
    await vi.waitFor(() => {
      if (expected) {
        expect(getGradeInput().props('errorMessage')).toBeTruthy()
      }
      else {
        expect(wrapper.vm.form.getFieldMeta('assessmentGrade')?.errors ?? []).toEqual([])
      }
    })
  }

  const setGradeEnabled = async (value: boolean) => {
    getToggle().vm.$emit('update:modelValue', value)
    await wrapper.vm.$nextTick()
  }

  const typeGradeValue = async (value: string, inputType = 'insertText') => {
    const input = getGradeInputDOM()
    const element = input.element as HTMLInputElement

    element.value = value
    await input.trigger('input', { inputType })
  }

  const stepGrade = async (value: string) => {
    const input = getGradeInputDOM()
    const element = input.element as HTMLInputElement

    element.value = value
    await input.trigger('input')
  }

  const commitGrade = async () => {
    await getGradeInputDOM().trigger('change')
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the toggle unchecked, enabled and with the correct description', () => {
      expect(getToggle().props()).toMatchObject({
        modelValue: false,
        disabled: false,
        description: DESCRIPTION,
      })
    })

    BddTest().then('it should not render the grade input', () => {
      expect(getGradeInput().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a grade', () => {
    beforeEach(() => {
      mountWith(20)
    })

    BddTest().then('it should render the toggle checked', () => {
      expect(getToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should render the grade input with the grade, the correct label and hint', () => {
      expect(getGradeInput().props()).toMatchObject({
        modelValue: '20',
        label: LABEL,
        hint: HINT,
      })
    })

    BddTest().then('it should use an integer step', () => {
      expect(getGradeStep()).toBe(1)
    })

    BddTest().then('it should use the step as the native min', () => {
      expect(getGradeInput().props('min')).toBe(1)
    })
  })

  BddTest().when('the component is mounted with a grade having one decimal', () => {
    beforeEach(() => {
      mountWith(12.5)
    })

    BddTest().then('it should use the step and the native min of the grade precision', () => {
      expect(getGradeStep()).toBe(0.1)
      expect(getGradeInput().props('min')).toBe(0.1)
    })
  })

  BddTest().when('the component is mounted with a grade having more decimals than allowed', () => {
    beforeEach(() => {
      mountWith(1.005)
    })

    BddTest().then('it should display the grade rounded to the allowed decimals', () => {
      expect(getGradeInput().props('modelValue')).toBe('1.01')
    })

    BddTest().then('it should use the step and the native min of the allowed decimals', () => {
      expect(getGradeStep()).toBe(0.01)
      expect(getGradeInput().props('min')).toBe(0.01)
    })
  })

  BddTest().when('the component is mounted disabled with a grade', () => {
    const disabledProps = {
      disabled: true,
      disabledTooltip: 'Disabled tooltip',
    }

    beforeEach(() => {
      mountWith(20, disabledProps)
    })

    BddTest().then('It should render the toggle checked and the grade set, with both disabled', () => {
      expect(getToggle().props()).toMatchObject({
        modelValue: true,
        ...disabledProps,
      })
      expect(getGradeInput().props()).toMatchObject({
        modelValue: '20',
        ...disabledProps,
      })
    })
  })

  BddTest().when('the grade is changed outside of the component', () => {
    beforeEach(async () => {
      mountWith(20)
      wrapper.vm.form.setFieldValue('assessmentGrade', 15)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should display the new grade', () => {
      expect(getGradeInput().props('modelValue')).toBe('15')
    })

    BddTest().then('it should not emit change', () => {
      expect(getChanges()).toBeFalsy()
    })
  })

  BddTest().when('the grade option is enabled', () => {
    beforeEach(async () => {
      mountWith()
      await setGradeEnabled(true)
    })

    BddTest().then('it should render the toggle checked', () => {
      expect(getToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should render an empty grade input', () => {
      expect(getGradeInput().exists()).toBe(true)
      expect(getGradeInput().props('modelValue')).toBe('')
    })

    BddTest().then('it should emit updateGradeEnabled true', () => {
      expect(getGradeEnabledUpdates()).toEqual([[true]])
    })

    BddTest().then('it should not emit change', () => {
      expect(getChanges()).toBeFalsy()
    })
  })

  BddTest().when('the grade option is disabled after a grade was set', () => {
    beforeEach(async () => {
      mountWith(20)
      await setGradeEnabled(false)
    })

    BddTest().then('it should hide the grade input', () => {
      expect(getGradeInput().exists()).toBe(false)
    })

    BddTest().then('it should render the toggle unchecked', () => {
      expect(getToggle().props('modelValue')).toBe(false)
    })

    BddTest().then('it should clear the grade', () => {
      expect(getGrade()).toBeUndefined()
    })

    BddTest().then('it should emit updateGradeEnabled false', () => {
      expect(getGradeEnabledUpdates()).toEqual([[false]])
    })
  })

  BddTest().when('the grade option is disabled after the grade was cleared', () => {
    beforeEach(async () => {
      mountWith(20)
      await typeGradeValue('', 'deleteContentBackward')
      await setGradeEnabled(false)
    })

    BddTest().then('it should clear errors', async () => {
      await expectGradeError(false)
    })
  })

  BddTest().when('a grade is typed', () => {
    beforeEach(async () => {
      mountWith()
      await setGradeEnabled(true)
      await typeGradeValue('12.5')
    })

    BddTest().then('it should display the typed value', () => {
      expect(getGradeInput().props('modelValue')).toBe('12.5')
    })

    BddTest().then('it should set the step to the typed precision', () => {
      expect(getGradeStep()).toBe(0.1)
    })
  })

  BddTest().when('a grade with a trailing zero is typed', () => {
    beforeEach(async () => {
      mountWith(20)
      await typeGradeValue('12.50')
    })

    BddTest().then('it should keep the typed trailing zero', () => {
      expect(getGradeInput().props('modelValue')).toBe('12.50')
    })

    BddTest().then('it should count the trailing zero in the step', () => {
      expect(getGradeStep()).toBe(0.01)
    })
  })

  BddTest().when('the grade is stepped with the arrows', () => {
    beforeEach(async () => {
      mountWith(1.19)
      await stepGrade('1.2')
    })

    BddTest().then('it should keep the step', () => {
      expect(getGradeStep()).toBe(0.01)
    })

    BddTest().then('it should display the value with its trailing zero', () => {
      expect(getGradeInput().props('modelValue')).toBe('1.20')
    })

    BddTest().then('it should store the stepped grade', () => {
      expect(getGrade()).toBe(1.2)
    })
  })

  BddTest().when('a grade with more than two decimals is committed', () => {
    beforeEach(async () => {
      mountWith(20)
      await typeGradeValue('12.345')
      await commitGrade()
    })

    BddTest().then('it should display the rounded grade', () => {
      expect(getGradeInput().props('modelValue')).toBe('12.35')
    })

    BddTest().then('it should store the rounded grade', () => {
      expect(getGrade()).toBe(12.35)
    })

    BddTest().then('it should not emit a redundant change on commit', () => {
      expect(getChanges()).toHaveLength(1)
    })
  })

  BddTest().when('the grade is cleared while the grade option is selected', () => {
    beforeEach(async () => {
      mountWith(20)
      await typeGradeValue('', 'deleteContentBackward')
    })

    BddTest().then('it should keep the grade option selected', () => {
      expect(getToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should clear the grade', () => {
      expect(getGrade()).toBeUndefined()
    })

    BddTest().then('it should show an error, the grade being required while the option is selected', async () => {
      await expectGradeError()
    })

    BddTest().then('it should still emit change, the container deciding whether to save', () => {
      expect(getChanges()).toHaveLength(1)
    })
  })

  BddTest().when('an invalid grade is typed and committed', () => {
    beforeEach(async () => {
      mountWith(20)
      await typeGradeValue('0')
      await commitGrade()
    })

    BddTest().then('it should store the grade', () => {
      expect(getGrade()).toBe(0)
    })

    BddTest().then('it should keep displaying the grade', () => {
      expect(getGradeInput().props('modelValue')).toBe('0')
    })

    BddTest().then('it should show an error', async () => {
      await expectGradeError()
    })
  })

  BddTest().when('an unparsable value is typed', () => {
    beforeEach(async () => {
      mountWith(20)
      await typeGradeValue('abc')
    })

    BddTest().then('it should clear the grade', () => {
      expect(getGrade()).toBeUndefined()
    })

    BddTest().then('it should show an error on the grade input', async () => {
      await expectGradeError()
    })
  })
})
