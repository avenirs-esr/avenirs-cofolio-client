import type { IdTitle } from '@/types'
import type { PropType } from 'vue'

export const CompactCardStub = defineComponent({
  name: 'CompactCard',
  props: {
    element: {
      type: Object as PropType<IdTitle>,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'var(--text1)',
    },
    iconColor: {
      type: String,
      required: false,
      default: 'var(--icon)',
    },
    backgroundColor: {
      type: String,
      required: false,
      default: 'var(--surface-background)',
    },
    borderColor: {
      type: String,
      required: false,
      default: 'var(--other-border-skill-card)',
    },
    iconBorderColor: {
      type: String,
      required: false,
      default: 'var(--other-border-skill-card)',
    },
  },
  template: `
    <div data-testid="compact-card">
      <span>{{ element.title }}</span>
      <slot />
    </div>
  `
})
