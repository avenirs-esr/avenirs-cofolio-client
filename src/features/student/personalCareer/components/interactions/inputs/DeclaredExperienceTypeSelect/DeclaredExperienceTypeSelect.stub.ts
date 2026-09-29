import type { EExperienceType } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeclaredExperienceTypeSelectStub = defineComponent({
  name: 'DeclaredExperienceTypeSelect',
  props: {
    modelValue: {
      type: Object as PropType<{ itemId: EExperienceType }>,
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
    <div data-testid="declared-experience-type-select-stub">
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      >
        <option value="">Select</option>
        <option value="PROFESSIONAL">Professional</option>
        <option value="PERSONAL">Personal</option>
        <option value="VOLUNTEER">Volunteer</option>
      </select>
    </div>
  `
})
