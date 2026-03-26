import type { PropType } from 'vue'

export const SelectorOverlayStub = defineComponent({
  name: 'SelectorOverlayStub',
  props: {
    selectableElements: {
      type: Array as PropType<{ label: string, value: string, baseElement: unknown }[]>,
      required: true,
    },
    selectedElements: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:selectedElements'],
  template: `
      <div class="selector-overlay-stub">
        <div 
          v-for="element in selectableElements"
          :key="element.value"
        >
          <a
            v-if="!readonly"
            role="button"
            class="selector-overlay-stub__element"
            :class="{ 'selector-overlay-stub__element--selected': selectedElements.includes(element.value) }"
            data-testid="selector-overlay"
            @click="$emit('update:selectedElements', toggleSelection(element.value))"
            @keydown.enter="$emit('update:selectedElements', toggleSelection(element.value))"
            @keydown.space="$emit('update:selectedElements', toggleSelection(element.value))"
          >
            {{ element.label }}
          </a>
          <slot name="default" :base-element="element.baseElement" :label="element.label" :value="element.value" :show-slot="element.showSlot">{{ element.label }}</slot>
        </div>
      </div>
    `,
  methods: {
    toggleSelection (value: string) {
      const isSelected = this.selectedElements.includes(value)
      if (isSelected) {
        return this.selectedElements.filter(v => v !== value)
      }
      else {
        return [...this.selectedElements, value]
      }
    },
  },
})
