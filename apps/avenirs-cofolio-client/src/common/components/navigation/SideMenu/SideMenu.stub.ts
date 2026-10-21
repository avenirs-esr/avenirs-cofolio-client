export const SideMenuStub = defineComponent({
  name: 'SideMenu',
  props: ['collapsed', 'collapsedWidth'],
  emits: ['update:collapsed'],
  template: '<div class="av-side-menu-stub"><slot /></div>'
})
