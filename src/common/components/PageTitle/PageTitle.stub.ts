import type { AvBreadcrumbProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const PageTitleStub = defineComponent({
  name: 'PageTitle',
  template: '<div><slot name="title" /></div>',
  props: {
    title: {
      type: String,
    },
    breadcrumbLinks: {
      type: Array as PropType<AvBreadcrumbProps['links']>,
    },
    back: {
      type: [String, Object] as PropType<RouteLocationRaw>,
    },
  },
})
