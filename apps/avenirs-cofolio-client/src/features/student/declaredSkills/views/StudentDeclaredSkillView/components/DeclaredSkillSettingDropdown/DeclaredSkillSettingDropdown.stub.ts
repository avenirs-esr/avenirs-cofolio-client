export const DeclaredSkillSettingDropdownStub = defineComponent({
  name: 'DeclaredSkillSettingDropdown',
  props: {
    elementId: { type: String, required: true },
    hasAssociations: { type: Boolean, required: true },
  },
  template: '<div data-testid="declared-skill-setting-dropdown" />',
  emits: ['update', 'delete']
})
