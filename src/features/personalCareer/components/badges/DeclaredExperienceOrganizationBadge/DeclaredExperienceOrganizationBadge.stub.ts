export const DeclaredExperienceOrganizationBadgeStub = defineComponent({
  name: 'DeclaredExperienceOrganizationBadge',
  props: {
    organization: { type: String, required: true }
  },
  template: '<div data-testid="declared-experience-organization-badge-stub">{{ organization }}</div>'
})
