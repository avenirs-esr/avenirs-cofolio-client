export const DeleteTraceAssociatedElementsDropdownStub = defineComponent({
  name: 'DeleteTraceAssociatedElementsDropdown',
  props: {
    skillsDisabled: {
      type: Boolean,
      default: false
    },
    activitiesDisabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['skillsSelected', 'activitiesSelected'],
  template: '<div class="delete-trace-associated-elements-dropdown-stub" />'
})
