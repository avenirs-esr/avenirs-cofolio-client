export const CardStub = defineComponent({
  name: 'Card',
  props: {
    titleOnly: { type: Boolean, default: false },
    backgroundColor: { type: String, default: 'var(--card)' },
    borderColor: { type: String, default: 'var(--stroke)' },
    titleBackground: { type: String, default: 'var(--surface-background)' },
    titleHeight: { type: String },
    collapsible: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
  },
  template: `
    <div data-testid="card-stub">
      <div data-testid="card-stub-title"><slot name="title" :collapsed="collapsed" /></div>
      <slot />
      <div data-testid="card-stub-body"><slot name="body" /></div>
      <div data-testid="card-stub-footer"><slot name="footer" /></div>
    </div>
  `,
})
