import type { AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const DetailPageTitleStub = defineComponent({
  name: 'DetailPageTitle',
  props: {
    title: {
      type: String,
    },
    trailingLinks: {
      type: Array as PropType<AvBreadcrumbProps['links']>
    },
  },
  template: `
    <div data-testid="detail-page-title">
      <slot name="title" />
      <slot name="actions" />
    </div>
  `
})
