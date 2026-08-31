export const ProfileCardStub = defineComponent({
  name: 'ProfileCard',
  props: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    profilePictureUrl: {
      type: String,
      required: true
    },
    coverPictureUrl: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      default: undefined
    }
  },
  template: '<div data-testid="profile-card-stub"><slot/></div>'
})
