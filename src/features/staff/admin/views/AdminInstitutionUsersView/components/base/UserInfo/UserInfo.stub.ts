export const UserInfoStub = defineComponent({
  name: 'UserInfo',
  props: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false
    },
    profilePictureUrl: {
      type: String,
      required: false
    }
  },
  template: `
    <div data-testid="user-info">
      <div v-if="profilePictureUrl" data-testid="profile-picture" />
      <div v-else data-testid="profile-icon" />
      <span data-testid="name">{{ firstName }} {{ lastName }}</span>
      <span v-if="email" data-testid="email">{{ email }}</span>
    </div>
  `
})
