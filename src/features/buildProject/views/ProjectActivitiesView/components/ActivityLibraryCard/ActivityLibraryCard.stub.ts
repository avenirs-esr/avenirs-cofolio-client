import type { DeclaredActivityViewDTO } from '@/api/avenir-esr'

export const ActivityLibraryCardStub = defineComponent({
  name: 'LibraryActivityCard',
  props: {
    activity: {
      type: Object as () => DeclaredActivityViewDTO,
      required: true
    }
  },
  template: `<div data-testid="declared-activity-card-stub"></div>`
})
