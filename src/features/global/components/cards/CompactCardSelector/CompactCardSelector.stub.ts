import type { PropType } from 'vue'

export const CompactCardSelectorStub = defineComponent({
  name: 'CompactCardSelectorStub',
  props: {
    elements: {
      type: Array as PropType<{ id: string, title: string, showSlot?: boolean, disabled?: boolean, baseElement?: unknown }[]>,
      required: true
    },
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
          @click="onToggle(element)"
          @keydown.enter="onToggle(element)"
          @keydown.space="onToggle(element)"
        >
          {{ element.title }}
        </a>
        <slot v-if="element.showSlot" :element="element.baseElement" />
      </div>
    </div>
  `,
  methods: {
    onToggle (element: { id: string, disabled?: boolean }) {
      if (element.disabled) {
        return
      }
      this.$emit('update:modelValue', this.toggleSelection(element.id))
    },
    toggleSelection (value: string) {
      const isSelected = this.modelValue.includes(value)
      return isSelected
        ? this.modelValue.filter(v => v !== value)
        : [...this.modelValue, value]
    }
  }
})
