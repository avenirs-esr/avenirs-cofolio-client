import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { EActivityThematic } from '@/api/avenir-esr'
import { DatePeriodPickerStub } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.stub'
import ActivityExecutionPeriodFormField from '@/features/staff/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.vue'
import { ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import { ToggleParameterCardStub } from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

function mountField (overrides: Partial<EditActivityFormData> = {}) {
  const TestWrapper = defineComponent({
    setup () {
      const defaultValues: EditActivityFormData = {
        title: 'Test activity',
        thematic: EActivityThematic.TRANSVERSAL,
        description: '',
        enableReflection: true,
        recommendedCompletionContexts: '',
        startDate: undefined,
        endDate: undefined,
        feedbackAllowedIterations: undefined,
        summary: '',
        traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
        bannerAction: EditActivityFormDataBannerAction.NONE,
        files: [],
        links: [],
        ...overrides,
      }
      const form = useForm({ defaultValues })
      return { form }
    },
    components: { ActivityExecutionPeriodFormField },
    template: `<ActivityExecutionPeriodFormField :form="form" />`,
  })

  return mount(TestWrapper, {
    global: {
      stubs: {
        ToggleParameterCard: ToggleParameterCardStub,
        DatePeriodPicker: DatePeriodPickerStub,
      },
    },
  })
}

BddTest().given('an ActivityExecutionPeriodFormField component', () => {
  let wrapper: VueWrapper

  const getFormField = () =>
    wrapper.findComponent(ActivityExecutionPeriodFormField) as VueWrapper<InstanceType<typeof ActivityExecutionPeriodFormField>>

  const getToggleParameterCard = () =>
    wrapper.findComponent(ToggleParameterCardStub)

  const getPeriodInput = () =>
    wrapper.findComponent(DatePeriodPickerStub)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted without any date', () => {
    beforeEach(() => {
      wrapper = mountField()
    })

    BddTest().then('it should render the parameter card', () => {
      expect(getToggleParameterCard().exists()).toBe(true)
    })

    BddTest().then('it should have the parameter card unchecked', () => {
      expect(getToggleParameterCard().props('modelValue')).toBe(false)
    })

    BddTest().then('it should not render DatePeriodPicker', () => {
      expect(getPeriodInput().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with startDate and endDate', () => {
    beforeEach(() => {
      wrapper = mountField({ startDate: '2025-02-01', endDate: '2025-10-29' })
    })

    BddTest().then('it should have the parameter card checked', () => {
      expect(getToggleParameterCard().props('modelValue')).toBe(true)
    })

    BddTest().then('it should render DatePeriodPicker', () => {
      expect(getPeriodInput().exists()).toBe(true)
    })

    BddTest().then('it should pass correct props to DatePeriodPicker', () => {
      const periodInput = getPeriodInput()
      expect(periodInput.props('startDate')).toBe('2025-02-01')
      expect(periodInput.props('endDate')).toBe('2025-10-29')
    })
  })

  BddTest().when('the toggle is enabled', () => {
    beforeEach(async () => {
      wrapper = mountField()
      getToggleParameterCard().vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should render DatePeriodPicker', () => {
      expect(getPeriodInput().exists()).toBe(true)
    })

    BddTest().then('it should not emit autosave', () => {
      expect(getFormField().emitted('autosave')).toBeFalsy()
    })

    BddTest().then('it should emit updateExecutionPeriodEnabled with true', () => {
      const emitted = getFormField().emitted('updateExecutionPeriodEnabled')
      expect(emitted).toBeTruthy()
      const lastCall = emitted![emitted!.length - 1][0]
      expect(lastCall).toBe(true)
    })
  })

  BddTest().when('the toggle is disabled after having dates set', () => {
    beforeEach(async () => {
      wrapper = mountField({ startDate: '2025-02-01', endDate: '2025-10-29' })
      getToggleParameterCard().vm.$emit('update:modelValue', false)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should hide DatePeriodPicker', () => {
      expect(getPeriodInput().exists()).toBe(false)
    })

    BddTest().then('it should emit autosave with enableCompletionPeriod set to false', () => {
      const emitted = getFormField().emitted('autosave')
      expect(emitted).toBeTruthy()
      const lastCall = emitted![emitted!.length - 1][0]
      expect(lastCall).toEqual({ enableCompletionPeriod: false })
    })

    BddTest().then('it should emit updateExecutionPeriodEnabled with false', () => {
      const emitted = getFormField().emitted('updateExecutionPeriodEnabled')
      expect(emitted).toBeTruthy()
      const lastCall = emitted![emitted!.length - 1][0]
      expect(lastCall).toBe(false)
    })
  })

  BddTest().when('only the start date is filled', () => {
    beforeEach(async () => {
      wrapper = mountField()
      getToggleParameterCard().vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()
      getPeriodInput().vm.$emit('update:startDate', '2025-02-01')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not emit autosave', () => {
      expect(getFormField().emitted('autosave')).toBeFalsy()
    })
  })

  BddTest().when('both dates are filled', () => {
    beforeEach(async () => {
      wrapper = mountField()
      getToggleParameterCard().vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()
      getPeriodInput().vm.$emit('update:startDate', '2025-02-01')
      await wrapper.vm.$nextTick()
      getPeriodInput().vm.$emit('update:endDate', '2025-10-29')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit autosave with both dates', () => {
      const emitted = getFormField().emitted('autosave')
      expect(emitted).toBeTruthy()
      const lastCall = emitted![emitted!.length - 1][0]
      expect(lastCall).toEqual({ startDate: '2025-02-01', endDate: '2025-10-29', enableCompletionPeriod: true })
    })
  })

  BddTest().when('both dates are cleared back to empty while the period stays enabled', () => {
    beforeEach(async () => {
      wrapper = mountField({ startDate: '2025-02-01', endDate: '2025-10-29' })
      getPeriodInput().vm.$emit('update:startDate', '')
      await wrapper.vm.$nextTick()
      getPeriodInput().vm.$emit('update:endDate', '')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit autosave with enableCompletionPeriod set to false', () => {
      const emitted = getFormField().emitted('autosave')
      expect(emitted).toBeTruthy()
      const lastCall = emitted![emitted!.length - 1][0]
      expect(lastCall).toEqual({ enableCompletionPeriod: false })
    })
  })
})
