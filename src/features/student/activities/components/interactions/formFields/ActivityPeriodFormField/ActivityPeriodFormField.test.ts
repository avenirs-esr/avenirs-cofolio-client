import type { UpdateActivityForm } from '@/features/student/global/types/forms.types'
import { DatePeriodPickerStub } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.stub'
import ActivityPeriodFormField from '@/features/student/activities/components/interactions/formFields/ActivityPeriodFormField/ActivityPeriodFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const commonsWrapperDefinitions = {
  components: { ActivityPeriodFormField },
  setup () {
    const form = useForm({
      defaultValues: {
        startDate: null,
        endDate: null,
      }
    }) as unknown as UpdateActivityForm
    return { form }
  },
}
const TestWrapperDefault = defineComponent({
  ...commonsWrapperDefinitions,
  template: `<form @submit.prevent="form.handleSubmit"><ActivityPeriodFormField :form="form" /></form>`
})

const TestWrapperCustomLabel = defineComponent({
  ...commonsWrapperDefinitions,
  template: `<form @submit.prevent="form.handleSubmit"><ActivityPeriodFormField :form="form" label="Mon label personnalisé" /></form>`
})

BddTest().given('an ActivityPeriodFormField component', () => {
  const stubs = {
    DatePeriodPicker: DatePeriodPickerStub
  }

  const getDatePeriodPicker = (wrapper: VueWrapper) =>
    wrapper.findComponent(DatePeriodPickerStub) as VueWrapper<InstanceType<typeof DatePeriodPickerStub>>

  BddTest().when('the component is mounted with default props', () => {
    let wrapper: VueWrapper<InstanceType<typeof TestWrapperDefault>>
    let periodInput: VueWrapper<InstanceType<typeof DatePeriodPickerStub>>

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapperDefault, { global: { stubs } })
      periodInput = getDatePeriodPicker(wrapper)
    })

    BddTest().then('it should render DatePeriodPicker', () => {
      expect(periodInput.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial startDate', () => {
      expect(periodInput.props('startDate')).toBe('')
    })

    BddTest().then('it should have empty initial endDate', () => {
      expect(periodInput.props('endDate')).toBe('')
    })

    BddTest().then('it should display the default i18n label', () => {
      expect(periodInput.props('label')).toBe('Ajouter une période de réalisation personnelle')
    })
  })

  BddTest().when('the component is mounted with a custom label', () => {
    let wrapper: VueWrapper<InstanceType<typeof TestWrapperCustomLabel>>
    let periodInput: VueWrapper<InstanceType<typeof DatePeriodPickerStub>>

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapperCustomLabel, { global: { stubs } })
      periodInput = getDatePeriodPicker(wrapper)
    })

    BddTest().then('it should use the custom label', () => {
      expect(periodInput.props('label')).toBe('Mon label personnalisé')
    })
  })

  BddTest().when('DatePeriodPicker emits update:startDate', () => {
    let wrapper: VueWrapper<InstanceType<typeof TestWrapperDefault>>

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapperDefault, { global: { stubs } })
      const periodInput = getDatePeriodPicker(wrapper)
      periodInput.vm.$emit('update:startDate', '2024-03-01')
    })

    BddTest().then('it should update the startDate', async () => {
      await vi.waitFor(() => {
        const updated = getDatePeriodPicker(wrapper)
        expect(updated.props('startDate')).toBe('2024-03-01')
      })
    })
  })

  BddTest().when('DatePeriodPicker emits update:endDate', () => {
    let wrapper: VueWrapper<InstanceType<typeof TestWrapperDefault>>

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapperDefault, { global: { stubs } })
      const periodInput = getDatePeriodPicker(wrapper)
      periodInput.vm.$emit('update:endDate', '2024-06-30')
    })

    BddTest().then('it should update the endDate', async () => {
      await vi.waitFor(() => {
        const updated = getDatePeriodPicker(wrapper)
        expect(updated.props('endDate')).toBe('2024-06-30')
      })
    })
  })
})
