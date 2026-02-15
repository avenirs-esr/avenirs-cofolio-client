import type { ProfileOverviewDTO } from '@/api/avenir-esr'

export const ProfileCardStub = defineComponent({
  name: 'ProfileCard',
  props: {
    studentSummary: {
      type: Object as () => ProfileOverviewDTO,
      required: true
    }
  },
  template: '<div data-testid="profile-card-stub"><slot/></div>'
})
