import type { AvBreadcrumbProps } from 'node_modules/@avenirs-esr/avenirs-dsav/dist/components/navigation/AvBreadcrumb/AvBreadcrumb.vue'
import type { PropType } from 'vue'

export const UpdatePageTitleStub = defineComponent({
  name: 'UpdatePageTitle',
  props: {
    title: {
      type: String,
    },
    breadcrumbLinks: {
      type: Array as PropType<AvBreadcrumbProps['links']>,
      required: true,
    },
  },
  template: `
    <div data-testid="update-page-title">
      <slot name="title" />
    </div>
  `
})
