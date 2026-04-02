export const SectionNavigationLayoutStub = defineComponent({
  name: 'SectionNavigationLayout',
  props: [
    'items',
    'defaultSection',
    'componentBySection',
    'propsBySection',
    'sideNavigationWidth',
    'selectPlaceholder',
    'selectLabel',
  ],
  template: `
    <div data-testid="section-navigation-layout" />
  `,
})
