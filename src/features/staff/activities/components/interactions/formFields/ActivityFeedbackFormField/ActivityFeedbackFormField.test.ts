import { InputStub } from '@/common/components/interaction/inputs/Input/Input.stub'
import { ToggleStub } from '@/common/components/Toggle/Toggle.stub'
import ActivityFeedbackFormField from '@/features/staff/activities/components/interactions/formFields/ActivityFeedbackFormField/ActivityFeedbackFormField.vue'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED, ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN } from '@/features/staff/activities/config'
import { FormFieldCardContainerStub } from '@/features/staff/global/components/cards/FormFieldCardContainer/FormFieldCardContainer.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { markRaw, nextTick } from 'vue'

function createMockForm () {
  const errors: string[] = []
  const fieldState = reactive({
    value: 1,
    meta: reactive({ errors }),
  })

  const feedbackAllowedIterationsState = {
    state: {
      value: {
        meta: {
          errors,
        },
      },
    },
  }

  const Field = defineComponent({
    name: 'Field',
    props: {
      name: {
        type: String,
        required: true,
      },
      validators: {
        type: Object,
        required: false,
      },
    },
    setup (props, { slots }) {
      const handleChange = (value: number | null | undefined) => {
        fieldState.value = value ?? 0
        const error = props.validators?.onChange?.({ value })
        errors.splice(0, errors.length, ...(error ? [error] : []))
      }

      return () => slots.default?.({
        field: {
          state: fieldState,
          handleChange,
        },
      })
    },
  })

  return {
    Field: markRaw(Field),
    useStore: () => ref(true),
    useField: () => feedbackAllowedIterationsState,
    setFieldValue: vi.fn((_, value: number) => {
      fieldState.value = value
    }),
  }
}

BddTest().given('an ActivityFeedbackFormField component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbackFormField>>
  let mockForm: ReturnType<typeof createMockForm>

  const getInput = () => wrapper.findComponent(InputStub)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mockForm = createMockForm()
    wrapper = mount(ActivityFeedbackFormField, {
      props: {
        form: mockForm as never,
      },
      global: {
        stubs: {
          Input: InputStub,
          FormFieldCardContainer: FormFieldCardContainerStub,
          Toggle: ToggleStub,
        },
      },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the input field', () => {
      expect(getInput().exists()).toBe(true)
    })

    BddTest().then('it should pass the min prop to the input', () => {
      expect(getInput().props('min')).toBe(ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN)
    })
  })

  BddTest().when('the input value is below the minimum', () => {
    beforeEach(async () => {
      await getInput().vm.$emit('update:modelValue', '-1')
    })

    BddTest().then('it should expose the min validation error', async () => {
      await vi.waitFor(() => {
        expect(getInput().props('errorMessage')).toBe(`Veuillez renseigner une valeur supérieure ou égale à ${ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_MIN}`)
      })
    })
  })

  BddTest().when('the toggle is disabled', () => {
    beforeEach(async () => {
      const toggle = wrapper.findComponent(ToggleStub)
      await toggle.find('input').setValue(false)
      await nextTick()
    })

    BddTest().then('it should reset the value to the disabled value', () => {
      expect(mockForm.setFieldValue).toHaveBeenCalledWith('feedbackAllowedIterations', ACTIVITY_FEEDBACK_ALLOWED_ITERATIONS_DISABLED)
    })

    BddTest().then('it should autosave zero after the debounce delay', async () => {
      await vi.advanceTimersByTimeAsync(ACTIVITY_AUTO_SAVE_DEBOUNCE)
      expect(wrapper.emitted('autosave')?.at(-1)).toEqual([{ feedbackAllowedIterations: 0 }])
    })
  })
})
