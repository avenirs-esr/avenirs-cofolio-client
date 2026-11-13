import type { AvSortableListItem } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'
import { defineComponent } from 'vue'

export const SortableListStub = defineComponent({
  name: 'SortableList',
  props: {
    ...AvInteractivePropsStub,
    modelValue: {
      type: Array as PropType<AvSortableListItem[]>,
      default: () => []
    },
    announcementFormatter: {
      type: Function as PropType<(element: AvSortableListItem, index: number, targetIndex: number) => string>,
      required: false
    },
    entityName: {
      type: String,
      required: false
    }
  },
  emits: ['update:modelValue'],
  template: `
    <div class="sortable-list-stub">
      <div
        v-for="(element, index) in modelValue"
        :key="element.id"
        class="sortable-list-stub__item"
      >
        <slot
          :element="element"
          :index="index"
        >
          {{ element.label }}
        </slot>
      </div>
    </div>
  `
})
