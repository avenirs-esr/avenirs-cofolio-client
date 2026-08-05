export const DeclaredProgramResultBadgeStub = defineComponent({
  name: 'DeclaredProgramResultBadge',
  props: {
    result: { type: String, required: true }
  },
  template: '<div data-testid="declared-program-result-badge-stub">{{ result }}</div>'
})
