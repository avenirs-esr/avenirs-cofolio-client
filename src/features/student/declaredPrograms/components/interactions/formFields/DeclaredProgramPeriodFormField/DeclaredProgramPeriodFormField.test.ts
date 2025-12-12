import type { AddDeclaredProgramForm, DeclaredProgramFormData } from '@/features/student/declaredPrograms/types/forms.types'
import DeclaredProgramPeriodFormField from '@/features/student/declaredPrograms/components/interactions/formFields/DeclaredProgramPeriodFormField/DeclaredProgramPeriodFormField.vue'
import { AvCheckboxStub, AvInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = defineComponent({
  components: {
    DeclaredProgramPeriodFormField
  },
  setup () {
    const form = useForm({
      defaultValues: {
        startDate: '',
        endDate: '',
        isOngoing: false
      } as DeclaredProgramFormData,
      validators: {
        onSubmit ({ value }) {
          const errors: Record<string, string | undefined> = {
            startDate: undefined,
            endDate: undefined,
            isOngoing: undefined
          }

          if (!value.startDate || value.startDate.trim() === '') {
            errors.startDate = 'La date de début est requise'
          }

          if (!value.isOngoing && (!value.endDate || value.endDate.trim() === '')) {
            errors.endDate = 'La date de fin est requise'
          }

          return { fields: errors }
        }
      }
    }) as unknown as AddDeclaredProgramForm

    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <DeclaredProgramPeriodFormField :form="form" />
    </form>
  `
})

BddTest().given('a declared program period form field', () => {
  let wrapper: VueWrapper<InstanceType<typeof TestWrapper>>

  const stubs = {
    AvCheckbox: AvCheckboxStub,
    AvInput: AvInputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
    })

    BddTest().then('it should render the checkbox and date inputs', () => {
      const checkbox = wrapper.findAllComponents({ name: 'AvCheckbox' })
      const inputs = wrapper.findAllComponents({ name: 'AvInput' })
      expect(checkbox.length).toBe(1)
      expect(inputs.length).toBe(2)
    })

    BddTest().then('it should have empty initial values', () => {
      const inputs = wrapper.findAllComponents({ name: 'AvInput' })
      expect(inputs[0].props('modelValue')).toBe('')
      expect(inputs[1].props('modelValue')).toBe('')
    })

    BddTest().then('it should have isOngoing unchecked', () => {
      const checkbox = wrapper.findComponent({ name: 'AvCheckbox' })
      expect(checkbox.props('modelValue')).toEqual([])
    })

    BddTest().then('it should enable end date input', () => {
      const inputs = wrapper.findAllComponents({ name: 'AvInput' })
      expect(inputs[1].props('disabled')).toBe(false)
    })
  })

  BddTest().and('the user enters a start date', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const inputs = wrapper.findAllComponents({ name: 'AvInput' })
      await inputs[0].vm.$emit('update:modelValue', '2024-01')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the start date value', async () => {
      await vi.waitFor(() => {
        const inputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(inputs[0].props('modelValue')).toBe('2024-01')
      })
    })
  })

  BddTest().and('the user enters an end date', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const inputs = wrapper.findAllComponents({ name: 'AvInput' })
      await inputs[1].vm.$emit('update:modelValue', '2024-12')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the end date value', async () => {
      await vi.waitFor(() => {
        const inputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(inputs[1].props('modelValue')).toBe('2024-12')
      })
    })
  })

  BddTest().and('the user checks isOngoing checkbox', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const checkbox = wrapper.findComponent({ name: 'AvCheckbox' })
      await checkbox.vm.$emit('update:modelValue', ['isOngoing'])
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should check the checkbox', async () => {
      await vi.waitFor(() => {
        const checkbox = wrapper.findComponent({ name: 'AvCheckbox' })
        expect(checkbox.props('modelValue')).toEqual(['isOngoing'])
      })
    })

    BddTest().then('it should disable end date input', async () => {
      await vi.waitFor(() => {
        const inputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(inputs[1].props('disabled')).toBe(true)
      })
    })

    BddTest().then('it should clear end date value', async () => {
      await vi.waitFor(() => {
        const inputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(inputs[1].props('modelValue')).toBe('')
      })
    })
  })

  BddTest().and('the user unchecks isOngoing checkbox', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const checkbox = wrapper.findComponent({ name: 'AvCheckbox' })
      await checkbox.vm.$emit('update:modelValue', ['isOngoing'])
      await wrapper.vm.$nextTick()
      await checkbox.vm.$emit('update:modelValue', [])
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should uncheck the checkbox', async () => {
      await vi.waitFor(() => {
        const checkbox = wrapper.findComponent({ name: 'AvCheckbox' })
        expect(checkbox.props('modelValue')).toEqual([])
      })
    })

    BddTest().then('it should enable end date input', async () => {
      await vi.waitFor(() => {
        const inputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(inputs[1].props('disabled')).toBe(false)
      })
    })
  })

  BddTest().and('the form is submitted with empty dates', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should show validation errors for start and end dates', async () => {
      await vi.waitFor(() => {
        const inputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(inputs[0].props('errorMessage')).toBe('La date de début est requise')
        expect(inputs[1].props('errorMessage')).toBe('La date de fin est requise')
      })
    })
  })

  BddTest().and('the form is submitted with valid dates', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const inputs = wrapper.findAllComponents({ name: 'AvInput' })
      await inputs[0].vm.$emit('update:modelValue', '2024-01')
      await inputs[1].vm.$emit('update:modelValue', '2024-12')
      await wrapper.vm.$nextTick()
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not show validation errors', async () => {
      await vi.waitFor(() => {
        const inputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(inputs[0].props('errorMessage')).toBeFalsy()
        expect(inputs[1].props('errorMessage')).toBeFalsy()
      })
    })
  })

  BddTest().and('the form is submitted with isOngoing checked and start date', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        global: { stubs }
      })
      const inputs = wrapper.findAllComponents({ name: 'AvInput' })
      const checkbox = wrapper.findComponent({ name: 'AvCheckbox' })
      await inputs[0].vm.$emit('update:modelValue', '2024-01')
      await checkbox.vm.$emit('update:modelValue', ['isOngoing'])
      await wrapper.vm.$nextTick()
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not show validation errors', async () => {
      await vi.waitFor(() => {
        const inputs = wrapper.findAllComponents({ name: 'AvInput' })
        expect(inputs[0].props('errorMessage')).toBeFalsy()
        expect(inputs[1].props('errorMessage')).toBeFalsy()
      })
    })
  })
})
