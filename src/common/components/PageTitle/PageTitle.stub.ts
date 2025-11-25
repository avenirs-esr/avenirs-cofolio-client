export const PageTitleStub = defineComponent({
  name: 'PageTitle',
  template: '<div><slot name="title" /></div>',
  props: ['title', 'breadcrumbLinks', 'back']
})
