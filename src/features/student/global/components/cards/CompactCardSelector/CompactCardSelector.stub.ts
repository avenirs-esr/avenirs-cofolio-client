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
  template: `<div data-testid="compact-card-selector"><slot v-if="elements.some(element => element.showSlot)" /></div>`
})
