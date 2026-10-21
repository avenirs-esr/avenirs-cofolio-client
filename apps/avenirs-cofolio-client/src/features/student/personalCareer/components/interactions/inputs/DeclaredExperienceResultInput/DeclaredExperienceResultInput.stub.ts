import type { PropType } from 'vue'

export const DeclaredExperienceResultInputStub = defineComponent({
  name: 'DeclaredExperienceResultInput',
  props: {
    modelValue: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    }
  },
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="declared-experience-result-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
