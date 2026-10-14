export const UserInfoSearchStub = defineComponent({
  name: 'UserInfoSearch',
  props: {
    modelValue: {
      type: [String, Number, null],
      default: '',
    }
  },
  emits: ['update:modelValue'],
  template: `<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />`
})
