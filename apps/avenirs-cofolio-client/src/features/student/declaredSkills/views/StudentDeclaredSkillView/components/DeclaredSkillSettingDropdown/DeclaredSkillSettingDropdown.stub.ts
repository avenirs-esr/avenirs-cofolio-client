import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'

export const DeclaredSkillSettingDropdownStub = defineComponent({
  name: 'DeclaredSkillSettingDropdown',
  props: {
    declaredSkillId: { type: String, required: true },
  },
  emits: [
    Action.UPDATE,
    Action.DELETE,
  ],
  template: `
    <div data-testid="declared-skill-setting-dropdown-stub">
      <button
        data-testid="update"
        @click="$emit('${Action.UPDATE}')"
      >
        ${Action.UPDATE}
      </button>
      <button
        data-testid="delete"
        @click="$emit('${Action.DELETE}')"
      >
        ${Action.DELETE}
      </button>
    </div>
  `,
})
