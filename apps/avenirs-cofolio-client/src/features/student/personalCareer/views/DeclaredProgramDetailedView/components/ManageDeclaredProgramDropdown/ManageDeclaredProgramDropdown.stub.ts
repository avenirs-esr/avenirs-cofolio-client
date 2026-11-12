export const ManageDeclaredProgramDropdownStub = defineComponent({
  name: 'ManageDeclaredProgramDropdown',
  props: {
    elementId: { type: String, required: true },
    hasAssociations: { type: Boolean, required: true },
  },
  emits: ['update', 'delete', 'associate', 'dissociate'],
  template: `
    <div class="manage-declared-program-dropdown-stub">
      <button
        data-testid="update"
        @click="$emit('update')"
      >
        Modifier
      </button>
      <button
        data-testid="delete"
        @click="$emit('delete')"
      >
        Supprimer
      </button>
    </div>
  `
})
