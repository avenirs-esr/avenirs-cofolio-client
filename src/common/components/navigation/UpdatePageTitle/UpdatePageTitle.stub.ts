import type { AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'

export const UpdatePageTitleStub = defineComponent({
  name: 'UpdatePageTitle',
  props: {
    title: {
      type: String,
    },
    trailingLinks: {
      type: Array as PropType<AvBreadcrumbProps['links']>
    },
  },
  template: `
    <div data-testid="update-page-title">
      <slot name="title" />
      <slot name="actions" />
    </div>
  `
})
