export const CategoryElementDescriptionTextareaStub = defineComponent({
  name: 'CategoryElementDescriptionTextarea',
  props: {
    id: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    errorMessage: { type: String, default: '' }
  },
  emits: ['blur', 'update:modelValue'],
  methods: {
    handleInput (event: Event) {
      const target = event.target as HTMLTextAreaElement
      const value = target.value
      const truncated = value.length > 400 ? value.substring(0, 400) : value
      this.$emit('update:modelValue', truncated)
    }
  },
  template: `
    <div class="self-knowledge-category-element-description-textarea-stub">
      <textarea
        :id="id"
        :value="modelValue"
        maxlength="400"
        @blur="$emit('blur')"
        @input="handleInput"
      />
      <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
    </div>
  `
})
