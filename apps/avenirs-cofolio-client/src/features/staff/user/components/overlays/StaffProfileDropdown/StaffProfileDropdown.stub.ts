export const StaffProfileDropdownStub = {
  name: 'StaffProfileDropdown',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  template: `
    <div data-testid="staff-profile-dropdown">
      <span>{{ username }}</span>
    </div>
  `,
}
