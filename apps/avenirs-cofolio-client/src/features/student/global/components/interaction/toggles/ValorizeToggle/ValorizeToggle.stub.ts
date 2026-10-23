export const ValorizeToggleStub = defineComponent({
  name: 'ValorizeToggle',
  props: [
    'id',
    'name',
    'modelValue',
    'activeText',
    'inactiveText',
    'statusTextWidth',
    'disabled',
    'description',
  ],
  emits: ['update:modelValue'],
  template: `
    <div class="valorize-toggle">
      <input
        type="checkbox"
        :id="id"
        :name="name"
        :checked="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
    </div>
  `,
})
