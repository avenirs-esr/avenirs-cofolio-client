export const IconTitleCardContainerStub = defineComponent({
  name: 'IconTitleCardContainer',
  props: ['title', 'titleIcon', 'required', 'backgroundColor', 'collapsible', 'collapsed', 'titleOnly'],
  template: `
    <div data-testid="form-field-card-container">
      <slot name="title" />
      <slot />
    </div>
  `,
})
