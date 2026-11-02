import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ToggleStub = defineComponent({
  name: 'Toggle',
  props: {
    ...AvInteractivePropsStub,
    id: String,
    name: String,
    modelValue: Boolean,
    description: String,
    activeText: String,
    inactiveText: String,
  },
  emits: ['update:modelValue'],
  template: `
    <div class="toggle">
      <input
        type="checkbox"
        :id="id"
        :name="name"
        :checked="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span class="description">
        {{ description }}
      </span>
      <slot :active="modelValue">
        <span class="status" :data-status="modelValue">
          {{ modelValue ? activeText : inactiveText }}
        </span>
      </slot>
    </div>
  `,
})
