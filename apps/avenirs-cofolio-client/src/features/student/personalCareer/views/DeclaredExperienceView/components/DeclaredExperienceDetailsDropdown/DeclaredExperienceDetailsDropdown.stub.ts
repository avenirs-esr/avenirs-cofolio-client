import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'

export const DeclaredExperienceDetailsDropdownStub = defineComponent({
  name: 'DeclaredExperienceDetailsDropdown',
  props: {
    declaredExperienceId: { type: String, required: true },
  },
  emits: [
    Action.UPDATE,
    Action.DELETE,
  ],
  template: `
    <div data-testid="declared-experience-details-dropdown-stub">
      <button
        data-testid="update"
        @click="$emit('${Action.UPDATE}')"
      >
        Modifier
      </button>
      <button
        data-testid="delete"
        @click="$emit('${Action.DELETE}')"
      >
        Supprimer
      </button>
    </div>
  `,
})
