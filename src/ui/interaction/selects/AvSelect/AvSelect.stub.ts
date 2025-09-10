export const AvSelectStub = defineComponent({
  name: 'AvSelect',
  props: {
    modelValue: [String, Number],
    options: Array,
    defaultUnselectedText: String,
    dense: Boolean
  },
  emits: ['update:modelValue'],
  template: `
    <select 
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="defaultUnselectedText !== undefined" value="">{{ defaultUnselectedText }}</option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
  `
})
