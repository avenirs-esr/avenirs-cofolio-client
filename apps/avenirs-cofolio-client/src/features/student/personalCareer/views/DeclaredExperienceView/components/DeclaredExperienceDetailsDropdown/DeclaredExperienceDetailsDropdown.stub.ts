export const DeclaredExperienceDetailsDropdownStub = defineComponent({
  name: 'DeclaredExperienceDetailsDropdown',

  props: {
    elementId: { type: String, required: true },
    hasAssociations: { type: Boolean, required: true },
  },
  emits: ['update', 'delete'],
  template: `
    <div class="declared-experience-details-dropdown-stub">
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
