import type { VueWrapper } from '@vue/test-utils'
import type { AlertUpdateForm, AlertUpdateFormData } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form/use-update-alert-form'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { DatePeriodPickerStub } from '@avenirs-esr/shared'
import { useForm } from '@tanstack/vue-form'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { nextTick } from 'vue'
import AlertPeriodFormField from '@/features/global-alert/views/AlertUpdateView/components/interactions/formFields/AlertPeriodFormField/AlertPeriodFormField.vue'
import { useUpdateAlertFormValidators } from '@/features/global-alert/views/AlertUpdateView/composables/use-update-alert-form-validators/use-update-alert-form-validators'

const START_DATE = '2026-11-05T10:00'
const END_DATE = '2026-11-08T18:00'
const NEW_START_DATE = '2026-12-01T09:00'
const NEW_END_DATE = '2026-12-02T17:00'

const TestWrapper = defineComponent({
  components: {
    AlertPeriodFormField,
  },
  props: {
    disabled: Boolean,
  },
  setup () {
    const { validateStartDate, validateEndDate } = useUpdateAlertFormValidators()

    const form = useForm({
      defaultValues: {
        message: 'Maintenance prévue ce soir',
        startDate: START_DATE,
        endDate: END_DATE,
      } as AlertUpdateFormData,
      validators: {
        onSubmit: ({ value }) => ({
          fields: {
            startDate: validateStartDate(value.startDate, value.endDate),
            endDate: validateEndDate(value.endDate, value.startDate),
          },
        }),
      },
    }) as unknown as AlertUpdateForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <AlertPeriodFormField :form="form" :disabled="disabled" />
    </form>
  `,
})

type WrapperInstance = InstanceType<typeof TestWrapper>
type FieldProps = WrapperInstance['$props']

BddTest().given('an alert period form field', () => {
  let wrapper: VueWrapper<WrapperInstance>

  const stubs = {
    DatePeriodPicker: DatePeriodPickerStub,
  }

  const mountWith = (props: FieldProps = {}) => {
    wrapper = mount(TestWrapper, {
      props,
      global: { stubs },
    })
  }

  const getPicker = () => wrapper.findComponent(DatePeriodPickerStub)

  beforeEach(() => {
    mountWith()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should configure a datetime-local date period picker', () => {
      expect(getPicker().props()).toMatchObject({
        type: 'datetime-local',
        inputFormat: 'dd/MM/yyyy HH:mm',
        outputFormat: 'dd/MM/yyyy HH:mm',
        showOngoing: false,
        disabled: false,
        labelVisible: true,
        startDate: START_DATE,
        endDate: END_DATE,
      })
    })
  })

  BddTest().when('the component is disabled', () => {
    beforeEach(() => {
      mountWith({
        disabled: true,
      })
    })

    BddTest().then('it should disable the picker', () => {
      expect(getPicker().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the picker emits a new start date', () => {
    beforeEach(async () => {
      getPicker().vm.$emit('update:startDate', NEW_START_DATE)
      await nextTick()
    })

    BddTest().then('it should update the start date', () => {
      expect(wrapper.vm.form.state.values.startDate).toBe(NEW_START_DATE)
    })
  })

  BddTest().when('the picker emits a new end date', () => {
    beforeEach(async () => {
      getPicker().vm.$emit('update:endDate', NEW_END_DATE)
      await nextTick()
    })

    BddTest().then('it should update the end date', () => {
      expect(wrapper.vm.form.state.values.endDate).toBe(NEW_END_DATE)
    })
  })

  BddTest().when('the picker emits a new period', () => {
    beforeEach(async () => {
      getPicker().vm.$emit('update:startDate', NEW_START_DATE)
      getPicker().vm.$emit('update:endDate', NEW_END_DATE)
      await nextTick()
    })

    BddTest().then('it should update both dates', () => {
      expect(wrapper.vm.form.state.values).toMatchObject({
        startDate: NEW_START_DATE,
        endDate: NEW_END_DATE,
      })
    })
  })

  BddTest().when('the picker is cleared', () => {
    beforeEach(async () => {
      getPicker().vm.$emit('update:startDate', '')
      getPicker().vm.$emit('update:endDate', '')
      await nextTick()
    })

    BddTest().then('it should reset both dates to undefined', () => {
      expect(wrapper.vm.form.state.values).toMatchObject({
        startDate: undefined,
        endDate: undefined,
      })
    })
  })

  BddTest().when('the form is submitted without an end date', () => {
    beforeEach(async () => {
      getPicker().vm.$emit('update:endDate', '')
      await wrapper.find('form').trigger('submit')
      await flushPromises()
    })

    BddTest().then('it should display the end date error', async () => {
      await vi.waitFor(() => {
        expect(getPicker().props('endDateErrors')).toEqual([expect.any(String)])
      })
    })
  })

  BddTest().when('the form is submitted without a start date', () => {
    beforeEach(async () => {
      getPicker().vm.$emit('update:startDate', '')
      await wrapper.find('form').trigger('submit')
      await flushPromises()
    })

    BddTest().then('it should display the start date error', async () => {
      await vi.waitFor(() => {
        expect(getPicker().props('startDateErrors')).toEqual([expect.any(String)])
      })
    })
  })
})
