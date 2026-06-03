import type { ActivityPresentationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityPublicationTabStub = defineComponent({
  name: 'ActivityPublicationTab',
  props: {
    modelValue: {
      type: [Object, null] as PropType<File | null>,
      required: true
    },
    activity: {
      type: Object as PropType<ActivityPresentationDTO>,
      required: true
    },
  },
  emits: ['published', 'update:modelValue'],
  template: '<div data-testid="activity-publication-tab-stub"></div>',
})
