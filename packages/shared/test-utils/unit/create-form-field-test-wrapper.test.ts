import type { CreateFormFieldTestWrapperOptions } from '#shared/test-utils/unit/index'
import type { VueWrapper } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import type { PropType } from 'vue'
import { createFormFieldTestWrapper } from '#shared/test-utils/unit/index'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'

enableAutoUnmount(afterEach)

interface FormData {
  title: string
}

type TestWrapper = ReturnType<typeof createFormFieldTestWrapper<FormData, 'title'>>
type TestForm = InstanceType<TestWrapper>['form']

const FormField = defineComponent({
  props: {
    form: { type: Object as PropType<TestForm>, required: true },
    label: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  setup (props) {
    const { api, state } = props.form.useField({ name: 'title' })

    return () => h('section', [
      h('input', {
        'value': state.value.value,
        'disabled': props.disabled,
        'aria-label': props.label,
        onInput (event: Event) {
          if (event.target instanceof HTMLInputElement) {
            api.handleChange(event.target.value)
          }
        },
      }),
      h('output', state.value.meta.errors.join(', ')),
    ])
  },
})

const defaultOptions: CreateFormFieldTestWrapperOptions<FormData, 'title'> = {
  formFieldComponent: FormField,
  fieldName: 'title',
  defaultValue: 'Initial title',
}

BddTest().given('the shared form field test wrapper', () => {
  BddTest().when('it is mounted with only required options', () => {
    let wrapper: VueWrapper<InstanceType<TestWrapper>>

    beforeEach(() => {
      wrapper = mount(createFormFieldTestWrapper<FormData, 'title'>(defaultOptions))
    })

    BddTest().then('it forwards a real form initialized with the field default and defaults extra props to empty', () => {
      expect(wrapper.get('input').element.value).toBe('Initial title')
      expect(wrapper.vm.form.getFieldValue('title')).toBe('Initial title')
      expect(wrapper.getComponent(FormField).props('form')).toBe(wrapper.vm.form)
      expect(wrapper.vm.extraProps).toEqual({})
      expect(wrapper.getComponent(FormField).props('label')).toBeUndefined()
      expect(wrapper.getComponent(FormField).vm.$attrs).toEqual({})
    })
  })

  BddTest().when('extra props are supplied', () => {
    let wrapper: VueWrapper<InstanceType<TestWrapper>>
    const extraProps = { 'label': 'Custom title', 'disabled': true, 'data-testid': 'custom-field' }

    beforeEach(() => {
      wrapper = mount(createFormFieldTestWrapper<FormData, 'title'>({ ...defaultOptions, extraProps }))
    })

    BddTest().then('it forwards the props and inherited attributes to the supplied field component', () => {
      expect(wrapper.getComponent(FormField).props()).toMatchObject({ label: 'Custom title', disabled: true })
      expect(wrapper.getComponent(FormField).attributes('data-testid')).toBe('custom-field')
      expect(wrapper.get('input').attributes('aria-label')).toBe('Custom title')
      expect(wrapper.get('input').element.disabled).toBe(true)
      expect(extraProps).toEqual({ 'label': 'Custom title', 'disabled': true, 'data-testid': 'custom-field' })
    })
  })

  BddTest().when('the same wrapper component is mounted twice and one field changes', () => {
    let first: VueWrapper<InstanceType<TestWrapper>>
    let second: VueWrapper<InstanceType<TestWrapper>>

    beforeEach(async () => {
      const Component = createFormFieldTestWrapper<FormData, 'title'>(defaultOptions)
      first = mount(Component)
      second = mount(Component)
      await first.get('input').setValue('Changed title')
    })

    BddTest().then('each mount owns a fresh form and independent field values', () => {
      expect(first.vm.form).not.toBe(second.vm.form)
      expect(first.vm.form.getFieldValue('title')).toBe('Changed title')
      expect(second.vm.form.getFieldValue('title')).toBe('Initial title')
      expect(second.get('input').element.value).toBe('Initial title')
    })
  })

  BddTest().when('the wrapper component is created without mounting', () => {
    const useValidator = vi.fn(() => vi.fn((value: string) => value ? undefined : 'Required'))

    beforeEach(() => {
      useValidator.mockClear()
      createFormFieldTestWrapper<FormData, 'title'>({ ...defaultOptions, useValidator })
    })

    BddTest().then('it does not invoke the optional validator factory outside setup', () => {
      expect(useValidator).not.toHaveBeenCalled()
    })
  })

  BddTest().when('a setup-composable validator is supplied and the changed field is submitted', () => {
    const useValidator = vi.fn(() => {
      const { t } = useI18n()
      return vi.fn((value: string) => value === 'invalid' ? t('invalidTitle') : undefined)
    })
    let wrapper: VueWrapper<InstanceType<TestWrapper>>
    let submitEvent: Event
    let preventDefault: MockInstance<Event['preventDefault']>

    beforeEach(async () => {
      useValidator.mockClear()
      const i18n = createI18n({
        legacy: false,
        locale: 'fr',
        messages: { fr: { invalidTitle: 'Titre invalide' } },
      })
      wrapper = mount(createFormFieldTestWrapper<FormData, 'title'>({ ...defaultOptions, useValidator }), {
        global: { plugins: [i18n] },
      })
      await wrapper.get('input').setValue('invalid')
      submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      preventDefault = vi.spyOn(submitEvent, 'preventDefault')
      wrapper.get('form').element.dispatchEvent(submitEvent)
    })

    BddTest().then('it creates the validator once inside setup and prevents the native submission', () => {
      expect(useValidator).toHaveBeenCalledExactlyOnceWith()
      expect(preventDefault).toHaveBeenCalledOnce()
      expect(submitEvent.defaultPrevented).toBe(true)
    })

    BddTest().then('it validates the current field value and exposes the translated field error', async () => {
      await vi.waitFor(() => {
        expect(useValidator.mock.results[0].value).toHaveBeenCalledWith('invalid')
        expect(wrapper.vm.form.getFieldMeta('title')?.errors).toEqual(['Titre invalide'])
        expect(wrapper.get('output').text()).toBe('Titre invalide')
        expect(wrapper.vm.form.state.isValid).toBe(false)
      })
    })
  })

  BddTest().when('the changed field is submitted without a validator', () => {
    let wrapper: VueWrapper<InstanceType<TestWrapper>>

    beforeEach(async () => {
      wrapper = mount(createFormFieldTestWrapper<FormData, 'title'>(defaultOptions))
      await wrapper.get('input').setValue('Updated without validation')
      await wrapper.get('form').trigger('submit')
    })

    BddTest().then('it completes submission without field errors', async () => {
      await vi.waitFor(() => {
        expect(wrapper.vm.form.getFieldValue('title')).toBe('Updated without validation')
        expect(wrapper.vm.form.getFieldMeta('title')?.errors).toEqual([])
        expect(wrapper.vm.form.state.isSubmitted).toBe(true)
        expect(wrapper.vm.form.state.isSubmitting).toBe(false)
        expect(wrapper.vm.form.state.isValid).toBe(true)
        expect(wrapper.get('output').text()).toBe('')
      })
    })
  })
})
