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
            @click="$emit('update:selectedElements', toggleSelection(element.value))"
            @keydown.enter="$emit('update:selectedElements', toggleSelection(element.value))"
            @keydown.space="$emit('update:selectedElements', toggleSelection(element.value))"
          >
            {{ element.label }}
          </a>
          <slot name="default" :label="element.label">{{ element.label }}</slot>
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
