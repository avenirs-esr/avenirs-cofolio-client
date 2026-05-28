import type { PropType } from 'vue'

export const ToggleParameterCardStub = defineComponent({
  name: 'ToggleParameterCard',
  props: {
    title: {
      type: String as PropType<string>,
      required: true,
    },
    icon: {
      type: String as PropType<string>,
      required: true,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  template: '<div class="toggle-parameter-card"><slot /></div>',
})
