export const AvTagPickerStub = defineComponent({
  name: 'AvTagPicker',
  props: [
    'label',
    'options',
    'selected',
    'handleSelectChange'
  ],
  template: `
        <div class="av-tag-picker-stub">
          <button
            v-for="option in options"
            :key="option.value"
            :data-testid="'option-' + option.value"
            @click="handleSelectChange(option)"
          >
            {{ option.label }}
          </button>
        </div>
      `
})
