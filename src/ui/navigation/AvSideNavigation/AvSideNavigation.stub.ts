export const AvSideNavigationStub = defineComponent({
  name: 'AvSideNavigation',
  props: {
    items: Array,
    selectedItem: String,
    isSideMenuCollapsed: Boolean,
    collapsedWidth: String
  },
  emits: ['update:selectedItem', 'update:isSideMenuCollapsed'],
  template: '<div class="av-side-navigation-stub" @click="$emit(\'update:isSideMenuCollapsed\', !isSideMenuCollapsed)" />'
})
