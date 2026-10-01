import type { SelectorOverlayElement } from '@/common/components/overlay/SelectorOverlay/SelectorOverlay.vue'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const SelectorOverlayStub = defineComponent({
  name: 'SelectorOverlay',
  props: {
    ...AvInteractivePropsStub,
    selectableElements: {
      type: Array as PropType<SelectorOverlayElement[]>,
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
          v-if="!readonly && !element.disabled"
          role="button"
          class="selector-overlay-stub__element"
          :class="{
            'selector-overlay-stub__element--selected': selectedElements.includes(element.value),
          }"
          data-testid="selector-overlay"
          @click="$emit('update:selectedElements', toggleSelection(selectedElements, element.value))"
          @keydown.enter="$emit('update:selectedElements', toggleSelection(selectedElements, element.value))"
          @keydown.space="$emit('update:selectedElements', toggleSelection(selectedElements, element.value))"
        >
          {{ element.label }}
        </a>

        <slot
          name="default"
          :base-element="element.baseElement"
          :label="element.label"
          :value="element.value"
          :show-slot="element.showSlot"
        >
          {{ element.label }}
        </slot>
      </div>
    </div>
  `,
  methods: {
    toggleSelection (selectedElements: string[], value: string): string[] {
      return selectedElements.includes(value)
        ? selectedElements.filter(selectedValue => selectedValue !== value)
        : [...selectedElements, value]
    },
  },
})
