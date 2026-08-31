export const TraceLinkInputStub = defineComponent({
  name: 'TraceLinkInput',
  props: {
    id: { type: String },
    modelValue: { type: String },
    label: { type: String },
    errorMessage: { type: String },
    required: { type: Boolean },
    maxlength: { type: Number },
    disabled: { type: Boolean },
  },
  emits: ['update:modelValue', 'blur'],
  template: '<div><input type="text" :id="id" :value="modelValue" :maxlength="maxlength" :required="required" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" /><span v-if="errorMessage" class="error">{{ errorMessage }}</span><span class="caption-light">{{ (modelValue?.length || 0) }} / {{ maxlength }} caractères (espaces compris)</span></div>',
})
