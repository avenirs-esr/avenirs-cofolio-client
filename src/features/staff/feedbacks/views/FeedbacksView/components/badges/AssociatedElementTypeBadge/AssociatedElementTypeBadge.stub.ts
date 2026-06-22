export const AssociatedElementTypeBadgeStub = defineComponent({
  name: 'AssociatedElementTypeBadge',
  props: { associatedElementType: { type: String, required: true } },
  template: '<div data-testid="associated-element-type-badge">{{ associatedElementType }}</div>'
})
