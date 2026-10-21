import type { PropType } from 'vue'

export const DeclaredExperienceDescriptionTextareaStub = defineComponent({
  name: 'DeclaredExperienceDescriptionTextarea',
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
    <div data-testid="declared-experience-description-textarea-stub">
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
    </div>
  `
})
