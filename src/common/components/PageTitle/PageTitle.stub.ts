import type { AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'

export const PageTitleStub = defineComponent({
  name: 'PageTitle',
  template: '<div data-testid="page-title"><slot name="title" /></div>',
  props: {
    title: {
      type: String,
    },
    breadcrumbLinks: {
      type: Array as PropType<AvBreadcrumbProps['links']>,
      required: true,
    },
  },
})
