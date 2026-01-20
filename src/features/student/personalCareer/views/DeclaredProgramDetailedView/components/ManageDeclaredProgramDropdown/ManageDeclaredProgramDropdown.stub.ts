export const ManageDeclaredProgramDropdownStub = defineComponent({
  name: 'ManageDeclaredProgramDropdown',
  emits: ['updateSelected', 'deleteSelected'],
  template: `
    <div class="manage-declared-program-dropdown-stub">
      <button
        data-testid="update"
        @click="$emit('updateSelected')"
      >
        Modifier
      </button>
      <button
        data-testid="delete"
        @click="$emit('deleteSelected')"
      >
        Supprimer
      </button>
    </div>
  `
})
