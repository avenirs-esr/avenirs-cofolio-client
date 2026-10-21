export const DeclaredProgramOrganizationBadgeStub = defineComponent({
  name: 'DeclaredProgramOrganizationBadge',
  props: {
    organization: { type: String, required: true },
    period: { type: String, default: undefined }
  },
  template: '<div data-testid="declared-program-organization-badge-stub">{{ organization }}</div>'
})
