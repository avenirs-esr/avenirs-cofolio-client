export const DeclaredExperienceDetailsDropdownStub = defineComponent({
  name: 'DeclaredExperienceDetailsDropdown',
  emits: ['updateSelected', 'deleteSelected', 'shareSelected'],
  template: `
    <div class="declared-experience-details-dropdown-stub">
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
      <button
        data-testid="share"
        @click="$emit('shareSelected')"
      >
        Partager
      </button>
    </div>
  `
})
