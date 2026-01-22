export const DeclaredExperiencesMoreActionsDropdownStub = defineComponent({
  name: 'DeclaredExperiencesMoreActionsDropdown',
  emits: ['addSelected', 'shareSelected', 'deleteSelected'],
  template: `
    <div class="declared-experiences-more-actions-dropdown-stub">
      <button
        data-testid="add"
        @click="$emit('addSelected')"
      >
        Ajouter
      </button>
      <button
        data-testid="share"
        @click="$emit('shareSelected')"
      >
        Partager
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
