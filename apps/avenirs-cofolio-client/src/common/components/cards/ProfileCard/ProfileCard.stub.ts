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
    profilePicture: {
      type: Object,
      required: true
    },
    coverPicture: {
      type: Object,
      required: true
    },
    bio: {
      type: String,
      default: undefined
    }
  },
  template: '<div data-testid="profile-card-stub"><slot/></div>'
})
