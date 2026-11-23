import type { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const UserCategoryBadgeStub = defineComponent({
  name: 'UserCategoryBadge',
  props: {
    category: {
      type: String as PropType<EUserCategory>,
      required: true,
    },
  },
  template: `<div data-testid="user-category-badge" />`,
})
