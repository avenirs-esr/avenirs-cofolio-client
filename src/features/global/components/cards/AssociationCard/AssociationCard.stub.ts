export const AssociationCardStub = defineComponent({
  name: 'AssociationCard',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    backgroundColor: {
      type: String,
      required: true
    },
    hoverBorderColor: {
      type: String,
      required: false
    },
    iconBorderColor: {
      type: String,
      required: false
    },
    to: {
      type: [String, Object],
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  template: '<div data-testid="association-card"><slot name="body" /><slot name="footer" /></div>'
})
