export const CategoryElementRatingRadioButtonSetStub = defineComponent({
  name: 'CategoryElementRatingRadioButtonSet',
  props: {
    modelValue: { type: Number, default: null },
    errorMessage: { type: String, default: '' }
  },
  emits: ['blur', 'update:modelValue'],
  template: `
    <div class="self-knowledge-category-element-rating-input-stub">
      <div class="rating-options">
        <button
          v-for="rating in [5, 4, 3, 2, 1, 0]"
          :key="rating"
          type="button"
          :data-rating="rating"
          @click="$emit('update:modelValue', rating)"
        >
          Rating {{ rating }}
        </button>
      </div>
      <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
    </div>
  `
})
