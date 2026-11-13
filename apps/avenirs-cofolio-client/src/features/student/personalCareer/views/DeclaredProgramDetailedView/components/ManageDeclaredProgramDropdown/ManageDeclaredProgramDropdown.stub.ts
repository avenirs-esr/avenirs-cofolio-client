export const ManageDeclaredProgramDropdownStub = defineComponent({
  name: 'ManageDeclaredProgramDropdown',
  props: {
    declaredProgramId: {
      type: String,
      required: true,
    },
  },
  emits: ['update', 'delete'],
  template: `
    <div class="manage-declared-program-dropdown-stub">
      <button data-testid="update" @click="$emit('update')">
        Modifier
      </button>
      <button data-testid="delete" @click="$emit('delete')">
        Supprimer
      </button>
    </div>
  `,
})
