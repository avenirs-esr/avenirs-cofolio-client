export const DeleteDeclaredSkillAssociatedElementsDropdownStub = defineComponent({
  name: 'DeleteDeclaredSkillAssociatedElementsDropdown',
  props: {
    activitiesDisabled: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['activitiesSelected'],
  template: '<div class="delete-declared-skill-associated-elements-dropdown-stub" />'
})
