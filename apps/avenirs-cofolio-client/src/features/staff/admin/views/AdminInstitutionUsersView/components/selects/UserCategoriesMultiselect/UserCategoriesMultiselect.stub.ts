import type { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const UserCategoriesMultiselectStub = defineComponent({
  name: 'UserCategoriesMultiselect',
  props: {
    modelValue: {
      type: Array as PropType<EUserCategory[]>,
      default: () => [],
    },
    disabled: Boolean,
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="user-categories-multiselect-stub" />',
})
