import type { PropType } from 'vue'

export const GroupNameStub = defineComponent({
  name: 'GroupNameStub',
  props: {
    group: {
      type: Object as PropType<{ id: string, name: string }>,
      required: true,
    },
    withNav: {
      type: Boolean,
      default: false,
    }
  },
  template: '<div data-testid="group-name">{{ group.name }}</div>',
})
