import type { Position } from '@vue-flow/core'
import type { PropType } from 'vue'

export const UpdateHandleSelectorStub = defineComponent({
  name: 'UpdateHandleSelector',
  props: {
    modelValue: { type: Boolean },
    position: { type: String as PropType<Position> },
  },
  emits: ['update:modelValue'],
  template: `
    <div class="toggle">
      <input
        type="checkbox"
        :id="position"
        :name="position"
        :checked="modelValue"
        @change="$emit(\'update:modelValue\', $event.target.checked)"
      />
      <span class="description">
        {{ position }}
      </span>
    </div>`
})
