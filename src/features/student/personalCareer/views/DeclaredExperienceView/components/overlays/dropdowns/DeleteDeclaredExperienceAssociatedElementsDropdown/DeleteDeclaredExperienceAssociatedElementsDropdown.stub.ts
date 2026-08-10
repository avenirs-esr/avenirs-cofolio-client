export const DeleteDeclaredExperienceAssociatedElementsDropdownStub = defineComponent({
  name: 'DeleteDeclaredExperienceAssociatedElementsDropdown',
  props: {
    tracesDisabled: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['tracesSelected'],
  template: '<div class="delete-declared-experience-associated-elements-dropdown-stub" />'
})
