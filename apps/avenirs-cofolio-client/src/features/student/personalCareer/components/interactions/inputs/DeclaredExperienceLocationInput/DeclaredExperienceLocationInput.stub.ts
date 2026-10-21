import type { PropType } from 'vue'

export const DeclaredExperienceLocationInputStub = defineComponent({
  name: 'DeclaredExperienceLocationInput',
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
    <div data-testid="declared-experience-location-input-stub">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
