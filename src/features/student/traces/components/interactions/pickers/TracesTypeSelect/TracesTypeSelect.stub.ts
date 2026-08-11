export const TracesTypeSelectStub = defineComponent({
  name: 'TracesTypeSelect',
  props: ['modelValue', 'errorMessage'],
  emits: ['update:modelValue', 'blur'],
  template: `
    <div data-testid="traces-type-select-stub">
      <select
        :value="modelValue?.itemId ?? ''"
        @change="$emit('update:modelValue', $event.target.value ? { itemId: $event.target.value } : undefined)"
        @blur="$emit('blur')"
      >
        <option value="">Select</option>
        <option value="TRACE">Trace</option>
      </select>
    </div>
  `
})
