import type { SubscribeActivityForm } from '@/features/student/buildProject/types/forms.types'
import ActivityPeriodFormField from '@/features/student/buildProject/components/interactions/formFields/ActivityPeriodFormField/ActivityPeriodFormField.vue'
import { AvPeriodInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
    }) as unknown as SubscribeActivityForm
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
    AvPeriodInput: AvPeriodInputStub
  }

  BddTest().when('the component is mounted with default props', () => {
    let wrapper: VueWrapper<InstanceType<typeof TestWrapperDefault>>
    let periodInput: VueWrapper<InstanceType<typeof AvPeriodInputStub>>

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapperDefault, { global: { stubs } })
      periodInput = wrapper.findComponent({ name: 'AvPeriodInput' }) as VueWrapper<InstanceType<typeof AvPeriodInputStub>>
    })

    BddTest().then('it should render AvPeriodInput', () => {
      expect(periodInput.exists()).toBe(true)
    })

    BddTest().then('it should have empty initial startModelValue', () => {
      expect(periodInput.props('startModelValue')).toBe('')
    })

    BddTest().then('it should have empty initial endModelValue', () => {
      expect(periodInput.props('endModelValue')).toBe('')
    })

    BddTest().then('it should display the default i18n label', () => {
      expect(periodInput.props('label')).toBe('Ajouter une période de réalisation personnelle')
    })
  })

  BddTest().when('the component is mounted with a custom label', () => {
    let wrapper: VueWrapper<InstanceType<typeof TestWrapperCustomLabel>>
    let periodInput: VueWrapper<InstanceType<typeof AvPeriodInputStub>>

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapperCustomLabel, { global: { stubs } })
      periodInput = wrapper.findComponent({ name: 'AvPeriodInput' }) as VueWrapper<InstanceType<typeof AvPeriodInputStub>>
    })

    BddTest().then('it should use the custom label', () => {
      expect(periodInput.props('label')).toBe('Mon label personnalisé')
    })
  })

  BddTest().when('AvPeriodInput emits update:startModelValue', () => {
    let wrapper: VueWrapper<InstanceType<typeof TestWrapperDefault>>

    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapperDefault, { global: { stubs } })
      const periodInput = wrapper.findComponent({ name: 'AvPeriodInput' })
      await periodInput.vm.$emit('update:startModelValue', '2024-03-01')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the startModelValue', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'AvPeriodInput' }) as VueWrapper<InstanceType<typeof AvPeriodInputStub>>
        expect(updated.props('startModelValue')).toBe('2024-03-01')
      })
    })
  })

  BddTest().when('AvPeriodInput emits update:endModelValue', () => {
    let wrapper: VueWrapper<InstanceType<typeof TestWrapperDefault>>

    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapperDefault, { global: { stubs } })
      const periodInput = wrapper.findComponent({ name: 'AvPeriodInput' })
      await periodInput.vm.$emit('update:endModelValue', '2024-06-30')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the endModelValue', async () => {
      await vi.waitFor(() => {
        const updated = wrapper.findComponent({ name: 'AvPeriodInput' }) as VueWrapper<InstanceType<typeof AvPeriodInputStub>>
        expect(updated.props('endModelValue')).toBe('2024-06-30')
      })
    })
  })
})
