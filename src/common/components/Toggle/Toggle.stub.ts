export const AvToggleStub = defineComponent({
  name: 'AvToggle',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    id: String,
    name: String,
    description: String,
    tooltip: String,
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  template: `
    <div
      class="av-toggle"
      v-bind="$attrs"
    >
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

      <span class="status">
        <slot :active="modelValue" />
      </span>
    </div>
  `,
})
