export const AvButtonStub = defineComponent({
  name: 'AvButton',
  props: ['label', 'variant', 'type', 'disabled', 'loading'],
  emits: ['click'],
  template: '<button :disabled="disabled" @click="$emit(\'click\')">{{ label }}</button>'
})
