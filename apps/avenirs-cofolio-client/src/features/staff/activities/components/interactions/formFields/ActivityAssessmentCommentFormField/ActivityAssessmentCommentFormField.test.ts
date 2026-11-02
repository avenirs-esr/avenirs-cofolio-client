import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { createFormFieldTestWrapper } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { ToggleStub } from '@/common/components/interaction/toggles/Toggle/Toggle.stub'
import ActivityAssessmentCommentFormField from '@/features/staff/activities/components/interactions/formFields/ActivityAssessmentCommentFormField/ActivityAssessmentCommentFormField.vue'

const DESCRIPTION = 'Permettre l\'ajout d\'un commentaire personnalisé pour chaque évaluation'

type MountingOptions = ComponentMountingOptions<typeof ActivityAssessmentCommentFormField>
type ComponentProps = Omit<MountingOptions['props'], 'form'>

function createTestWrapper (initialValue: boolean, props: ComponentProps) {
  return createFormFieldTestWrapper<EditActivityFormData, 'assessmentComment'>({
    formFieldComponent: ActivityAssessmentCommentFormField,
    fieldName: 'assessmentComment',
    defaultValue: initialValue,
    extraProps: props,
  })
}

BddTest().given('an ActivityAssessmentCommentFormField component', () => {
  let wrapper: VueWrapper<InstanceType<ReturnType<typeof createTestWrapper>>>

  const stubs = {
    Toggle: ToggleStub,
  }

  const mountWith = (initialValue = false, props: ComponentProps = {}) => {
    wrapper = mount(createTestWrapper(initialValue, props), {
      global: { stubs },
    })
  }

  const getFormField = () => wrapper.findComponent(ActivityAssessmentCommentFormField)
  const getToggle = () => wrapper.findComponent(ToggleStub)

  const getValue = () => wrapper.vm.form.getFieldValue('assessmentComment')
  const getChanges = () => getFormField().emitted('change')

  const setValue = async (value: boolean) => {
    getToggle().vm.$emit('update:modelValue', value)
    await wrapper.vm.$nextTick()
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
  })

  BddTest().when('the component is mounted checked', () => {
    beforeEach(() => {
      mountWith(true)
    })

    BddTest().then('it should render the toggle checked', () => {
      expect(getToggle().props('modelValue')).toBe(true)
    })
  })

  BddTest().when('the component is mounted disabled', () => {
    const disabledProps = {
      disabled: true,
      disabledTooltip: 'Disabled tooltip',
    }

    beforeEach(() => {
      mountWith(true, disabledProps)
    })

    BddTest().then('it should render the toggle checked and disabled', () => {
      expect(getToggle().props()).toMatchObject({
        modelValue: true,
        ...disabledProps,
      })
    })
  })

  BddTest().when('the toggle is checked', () => {
    beforeEach(async () => {
      mountWith()
      await setValue(true)
    })

    BddTest().then('it should update the form value', () => {
      expect(getValue()).toBe(true)
    })

    BddTest().then('it should render the toggle checked', () => {
      expect(getToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should emit change once', () => {
      expect(getChanges()).toHaveLength(1)
    })
  })

  BddTest().when('the toggle is unchecked', () => {
    beforeEach(async () => {
      mountWith(true)
      await setValue(false)
    })

    BddTest().then('it should update the form value', () => {
      expect(getValue()).toBe(false)
    })

    BddTest().then('it should render the toggle unchecked', () => {
      expect(getToggle().props('modelValue')).toBe(false)
    })

    BddTest().then('it should emit change once', () => {
      expect(getChanges()).toHaveLength(1)
    })
  })

  BddTest().when('the value is changed outside of the component', () => {
    beforeEach(async () => {
      mountWith()
      wrapper.vm.form.setFieldValue('assessmentComment', true)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should render the toggle accordingly', () => {
      expect(getToggle().props('modelValue')).toBe(true)
    })

    BddTest().then('it should not emit change', () => {
      expect(getChanges()).toBeFalsy()
    })
  })
})
