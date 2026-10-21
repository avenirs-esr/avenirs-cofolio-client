export const StudentProfileDropdownStub = {
  name: 'StudentProfileDropdown',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  template: `
    <div data-testid="student-profile-dropdown">
      <span>{{ username }}</span>
    </div>
  `,
}
