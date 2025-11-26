export const CategoryElementTitleInputStub = defineComponent({
  name: 'CategoryElementTitleInput',
  props: {
    id: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
    required: { type: Boolean, default: false }
  },
  emits: ['blur', 'update:modelValue'],
  template: `
    <div class="self-knowledge-category-element-title-input-stub">
      <input
        :id="id"
        type="text"
        :value="modelValue"
        :required="required"
        maxlength="250"
        @blur="$emit('blur')"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
    </div>
  `
})
