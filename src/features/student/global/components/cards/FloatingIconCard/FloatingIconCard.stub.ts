export const FloatingIconCardStub = defineComponent({
  name: 'FloatingIconCard',
  template: `
    <div class="floating-icon-card">
      <div class="card-title">{{ title }}</div>
      <div class="card-icon">{{ iconOptions?.name }}</div>
      <div class="card-body"><slot name="body" /></div>
      <div class="card-footer"><slot name="footer" /></div>
    </div>
  `,
  props: ['title', 'iconOptions', 'color', 'borderColor', 'customTitleHeight', 'headerRows', 'height', 'titleTypographyClasses']
})
