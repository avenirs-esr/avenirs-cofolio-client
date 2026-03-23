export const CheckboxResultListStub = defineComponent({
  name: 'CheckboxResultList',
  props: {
    results: {
      type: Array,
      required: true,
    },
    height: {
      type: String,
      default: 'auto',
    },
    width: {
      type: String,
      default: 'auto',
    },
    maxLines: {
      type: Number,
      default: 1,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  template: `
    <div v-for="result in results" :key="result.id">
      <label :style="{ display: '-webkit-box', WebkitBoxOrient: 'vertical', lineClamp: maxLines, WebkitLineClamp: maxLines, overflow: 'hidden' }">
        <input type="checkbox" :value="result.id" v-model="modelValue" @change="$emit('update:modelValue', modelValue)" />
        {{ result.title }}
      </label>
    </div>
  `,
})
