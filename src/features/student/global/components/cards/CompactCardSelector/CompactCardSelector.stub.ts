import type { PropType } from 'vue'

export const CompactCardSelectorStub = defineComponent({
  name: 'CompactCardSelectorStub',
  props: {
    elements: { type: Array as PropType<{ id: string, title: string, showSlot?: boolean }[]>, required: true },
    readonly: { type: Boolean, default: false },
    icon: { type: String, required: true },
    color: { type: String },
    backgroundColor: { type: String },
    iconBorderColor: { type: String },
    checkboxColor: { type: String },
    overlayColor: { type: String },
    overlayOpacity: { type: Number },
    modelValue: { type: Array as PropType<string[]>, default: () => [] }
  },
  emits: ['update:modelValue'],
  template: `
    <div data-testid="compact-card-selector-stub">
      <div v-for="element in elements" :key="element.id">
        <a
          v-if="!readonly"
          role="button"
          data-testid="compact-card-selector"
          @click="$emit('update:modelValue', toggleSelection(element.id))"
          @keydown.enter="$emit('update:modelValue', toggleSelection(element.id))"
          @keydown.space="$emit('update:modelValue', toggleSelection(element.id))"
        >
          {{ element.title }}
        </a>
        <slot v-if="element.showSlot" />
      </div>
    </div>
  `,
  methods: {
    toggleSelection (value: string) {
      const isSelected = this.modelValue.includes(value)
      if (isSelected) {
        return this.modelValue.filter(v => v !== value)
      }
      else {
        return [...this.modelValue, value]
      }
    },
  },
})
