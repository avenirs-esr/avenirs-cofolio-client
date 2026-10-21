export const DeclaredExperiencesMoreActionsDropdownStub = defineComponent({
  name: 'DeclaredExperiencesMoreActionsDropdown',
  emits: ['add', 'delete'],
  template: `
    <div class="declared-experiences-more-actions-dropdown-stub">
      <button
        data-testid="add"
        @click="$emit('add')"
      >
        Ajouter
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
