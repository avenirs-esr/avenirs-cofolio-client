import type { AvSideNavigationProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'

export const SideNavigationStub = defineComponent({
  name: 'SideNavigation',
  props: {
    items: Array as PropType<AvSideNavigationProps['items']>,
    selectedItem: {
      type: Object as () => { itemId: string, parentId?: string },
      required: true
    },
    isSideMenuCollapsed: Boolean,
    hideContentWhenCollapsed: Boolean,
    collapsedWidth: String,
    sticky: Boolean,
    stickyOffset: String,
  },
  emits: ['update:selectedItem', 'update:isSideMenuCollapsed'],
  template: `
    <div
      class="av-side-navigation-stub"
      @click="$emit(\'update:isSideMenuCollapsed\', !isSideMenuCollapsed)"
    />
  `
})
