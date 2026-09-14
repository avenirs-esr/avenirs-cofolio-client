import type { AvBreadcrumbProps } from 'node_modules/@avenirs-esr/avenirs-dsav/dist/components/navigation/AvBreadcrumb/AvBreadcrumb.vue'
import type { PropType } from 'vue'

export const DetailedPageTitleStub = defineComponent({
  name: 'DetailedPageTitle',
  props: {
    title: {
      type: String,
    },
    trailingLinks: {
      type: Array as PropType<AvBreadcrumbProps['links']>,
      required: true,
    },
  },
  template: `
    <div data-testid="detailed-page-title">
      <slot name="title" />
    </div>
  `
})
