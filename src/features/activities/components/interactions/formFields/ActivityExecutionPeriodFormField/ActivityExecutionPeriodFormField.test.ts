import type { EditActivityFormData } from '@/features/activities/types/forms.types'
import { EActivityThematic } from '@/api/avenir-esr'
import ActivityExecutionPeriodFormField from '@/features/activities/components/interactions/formFields/ActivityExecutionPeriodFormField/ActivityExecutionPeriodFormField.vue'
import { ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/activities/config'
import { EditActivityFormDataBannerAction } from '@/features/activities/types/forms.types'
import { ToggleParameterCardStub } from '@/features/global/components/cards/ToggleParameterCard/ToggleParameterCard.stub'
import { AvPeriodInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
        AvPeriodInput: AvPeriodInputStub,
      },
    },
  })
}

BddTest().given('an ActivityExecutionPeriodFormField component', () => {
  let wrapper: VueWrapper

  const getFormField = () =>
    wrapper.findComponent(ActivityExecutionPeriodFormField) as VueWrapper<InstanceType<typeof ActivityExecutionPeriodFormField>>

  const getToggleParameterCard = () =>
    wrapper.findComponent(ToggleParameterCardStub) as VueWrapper<InstanceType<typeof ToggleParameterCardStub>>

  const getPeriodInput = () =>
    wrapper.findComponent(AvPeriodInputStub) as VueWrapper<InstanceType<typeof AvPeriodInputStub>>

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

    BddTest().then('it should not render AvPeriodInput', () => {
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

    BddTest().then('it should render AvPeriodInput', () => {
      expect(getPeriodInput().exists()).toBe(true)
    })

    BddTest().then('it should pass correct props to AvPeriodInput', () => {
      const periodInput = getPeriodInput()
      expect(periodInput.props('startModelValue')).toBe('2025-02-01')
      expect(periodInput.props('endModelValue')).toBe('2025-10-29')
    })
  })

  BddTest().when('the toggle is enabled', () => {
    beforeEach(async () => {
      wrapper = mountField()
      getToggleParameterCard().vm.$emit('update:modelValue', true)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should render AvPeriodInput', () => {
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

    BddTest().then('it should hide AvPeriodInput', () => {
      expect(getPeriodInput().exists()).toBe(false)
    })

    BddTest().then('it should emit autosave with both dates undefined', () => {
      const emitted = getFormField().emitted('autosave')
      expect(emitted).toBeTruthy()
      const lastCall = emitted![emitted!.length - 1][0]
      expect(lastCall).toEqual({ startDate: undefined, endDate: undefined })
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
      getPeriodInput().vm.$emit('update:startModelValue', '2025-02-01')
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
      getPeriodInput().vm.$emit('update:startModelValue', '2025-02-01')
      await wrapper.vm.$nextTick()
      getPeriodInput().vm.$emit('update:endModelValue', '2025-10-29')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit autosave with both dates', () => {
      const emitted = getFormField().emitted('autosave')
      expect(emitted).toBeTruthy()
      const lastCall = emitted![emitted!.length - 1][0]
      expect(lastCall).toEqual({ startDate: '2025-02-01', endDate: '2025-10-29' })
    })
  })
})
