import type { CreateTraceForm } from '@/features/student/traces/types/forms.types'
import { ETraceAuthorType } from '@/api/avenir-esr'
import { TraceAuthorTypeRadioSetStub } from '@/features/student/traces/components/interactions/radios/TraceAuthorTypeRadioSet/TraceAuthorTypeRadioSet.stub'
import TraceAuthorTypeRadioSetFormField from '@/features/student/traces/components/interactions/radios/TraceAuthorTypeRadioSetFormField/TraceAuthorTypeRadioSetFormField.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const TestWrapper = {
  components: { TraceAuthorTypeRadioSetFormField },
  props: ['initialAuthorType'],
  setup (props: { initialAuthorType: ETraceAuthorType | null }) {
    const form = useForm({
      defaultValues: {
        authorType: props.initialAuthorType
      },
      validators: {
        onSubmit ({ value }) {
          return {
            fields: {
              authorType: !value.authorType ? 'Ce champ est requis.' : undefined
            }
          }
        }
      }
    }) as unknown as CreateTraceForm
    return { form }
  },
  template: `
    <form @submit.prevent="form.handleSubmit">
      <TraceAuthorTypeRadioSetFormField :form="form" />
    </form>
  `
}

BddTest().given('a trace author type radio set form field component', () => {
  let wrapper: VueWrapper

  const stubs = {
    TraceAuthorTypeRadioSet: TraceAuthorTypeRadioSetStub
  }

  BddTest().and('with initial value COLLECTIVE', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        props: { initialAuthorType: ETraceAuthorType.COLLECTIVE },
        global: { stubs }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the radio set', () => {
        expect(wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' }).exists()).toBe(true)
      })

      BddTest().then('it should have initial value', () => {
        const radioSet = wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' })
        expect(radioSet.props('modelValue')).toBe(ETraceAuthorType.COLLECTIVE)
      })

      BddTest().then('it should not have error message initially', () => {
        const radioSet = wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' })
        expect(radioSet.props('errorMessage')).toBeFalsy()
      })
    })

    BddTest().when('the user selects a valid value', () => {
      BddTest().then('it should update the form field value', async () => {
        const radioSet = wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' })
        await radioSet.vm.$emit('update:modelValue', ETraceAuthorType.COLLECTIVE)
        await wrapper.vm.$nextTick()
        await vi.waitFor(() => {
          expect(wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' }).props('modelValue')).toBe(ETraceAuthorType.COLLECTIVE)
        })
      })
    })

    BddTest().when('the user selects an invalid value', () => {
      BddTest().then('it should not update the form field', async () => {
        const radioSet = wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' })
        await radioSet.vm.$emit('update:modelValue', 'INVALID_VALUE')
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' }).props('modelValue')).toBe(ETraceAuthorType.COLLECTIVE)
      })
    })

    BddTest().when('the user blurs the field', () => {
      BddTest().then('it should trigger blur handler', async () => {
        const radioSet = wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' })
        await radioSet.vm.$emit('blur')
        await wrapper.vm.$nextTick()
        expect(radioSet.emitted('blur')).toBeTruthy()
      })
    })
  })

  BddTest().and('with null initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TestWrapper, {
        props: { initialAuthorType: null },
        global: { stubs }
      })
    })

    BddTest().when('the form is submitted with null authorType', () => {
      BddTest().then('it should show validation error', async () => {
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()
        await vi.waitFor(() => {
          expect(wrapper.findComponent({ name: 'TraceAuthorTypeRadioSet' }).props('errorMessage')).toBe('Ce champ est requis.')
        })
      })
    })
  })
})
