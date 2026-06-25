export const UserProfilePopoverStub = {
  name: 'UserProfilePopover',
  props: ['username', 'actions'],
  template: `
    <div data-testid="user-profile-popover">
      <button>{{ username }}</button>
      <button
        v-for="action in actions"
        :key="action.label"
      >
        {{ action.label }}
      </button>
    </div>
  `,
}
