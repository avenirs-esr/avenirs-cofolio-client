import type { AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'

export const DetailedPageTitleStub = defineComponent({
  name: 'DetailedPageTitle',
  props: {
    title: {
      type: String,
    },
    trailingLinks: {
      type: Array as PropType<AvBreadcrumbProps['links']>
    },
  },
  template: `
    <div data-testid="detailed-page-title">
      <slot name="title" />
      <slot name="actions" />
    </div>
  `
})
