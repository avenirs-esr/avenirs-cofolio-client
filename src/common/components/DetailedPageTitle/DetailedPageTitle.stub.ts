export const DetailedPageTitleStub = defineComponent({
  name: 'DetailedPageTitle',
  props: ['title', 'breadcrumbLinks', 'back'],
  template: `
    <div class="detailed-page-title-stub">
      <slot name="title" />
    </div>
  `
})
