import type {
  SectionNavigationItem,
} from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import type { Component, PropType } from 'vue'

export const SectionNavigationLayoutStub = defineComponent({
  name: 'SectionNavigationLayout',
  props: {
    items: {
      type: Array as PropType<SectionNavigationItem[]>,
      required: true,
    },
    defaultSection: {
      type: String,
      required: true,
    },
    componentBySection: {
      type: Object as PropType<Record<string, Component>>,
      required: true,
    },
    propsBySection: {
      type: Object as PropType<Record<string, Record<string, unknown>>>,
      required: false,
    },
    sideNavigationWidth: {
      type: String,
      required: false,
    },
    selectPlaceholder: {
      type: String,
      required: true,
    },
    selectLabel: {
      type: String,
      required: false,
    },
    isLoading: {
      type: Boolean,
      required: false,
    },
  },
  template: `
    <div data-testid="section-navigation-layout" />
  `,
})
