export const AssociationsCardStub = defineComponent({
  name: 'AssociationsCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  template: '<div data-testid="associations-card-stub"><slot /></div>',
})
