export const ToggleStub = defineComponent({
  name: 'Toggle',
  props: ['id', 'name', 'modelValue', 'description', 'activeText', 'inactiveText', 'disabled'],
  emits: ['update:modelValue'],
  template: `
    <div class="toggle">
      <input
        type="checkbox"
        :id="id"
        :name="name"
        :checked="modelValue"
        :disabled="disabled"
        @change="$emit(\'update:modelValue\', $event.target.checked)"
      />
      <span class="description">
        {{ description }}
      </span>
      <slot :active="modelValue">
        <span class="status" :data-status="modelValue">
          {{ modelValue ? activeText : inactiveText }}
        </span>
      </slot>
    </div>`
})
