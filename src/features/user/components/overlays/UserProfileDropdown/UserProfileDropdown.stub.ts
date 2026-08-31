import type { UserProfileDropdownAction } from '@/common/components/overlay/UserProfileDropdown/UserProfileDropdown.vue'
import type { PropType } from 'vue'

export const UserProfileDropdownStub = {
  name: 'UserProfileDropdown',
  props: {
    username: {
      type: String,
      required: true,
    },
    actions: {
      type: Array as PropType<UserProfileDropdownAction[]>,
      default: () => [],
    },
  },
  emits: ['actionSelected'],
  template: `
    <div data-testid="user-profile-dropdown">
      <button data-testid="user-profile-dropdown-trigger">
        {{ username }}
      </button>

      <button
        v-for="action in actions"
        :key="action.name"
        :data-testid="action.name"
        @click="$emit('actionSelected', action.name)"
      >
        {{ action.label }}
      </button>
    </div>
  `,
}
