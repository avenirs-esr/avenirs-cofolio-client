import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const FooterStub = defineComponent({
  name: 'FooterStub',
  props: {
    accessibilityLink: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true,
    },
    cookiesLink: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true,
    },
    legalLink: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true,
    },
    personalDataLink: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true,
    },
  },
  template: '<div data-testid="footer-stub" />'
})
