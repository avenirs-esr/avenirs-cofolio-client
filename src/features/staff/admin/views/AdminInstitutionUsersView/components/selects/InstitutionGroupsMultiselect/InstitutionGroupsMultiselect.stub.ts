import type { PropType } from 'vue'

export const InstitutionGroupsMultiselectStub = defineComponent({
  name: 'InstitutionGroupsMultiselect',
  props: {
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="institution-groups-multiselect-stub" />',
})
