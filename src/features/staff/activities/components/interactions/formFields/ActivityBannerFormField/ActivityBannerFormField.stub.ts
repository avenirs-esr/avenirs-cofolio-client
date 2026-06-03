import type { FileDTO } from '@/api/avenir-esr'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

export const ActivityBannerFormFieldStub = defineComponent({
  name: 'ActivityBannerFormField',
  props: {
    modelValue: {
      type: [Object, null] as PropType<File | null>,
      required: true
    },
    form: {
      type: Object as PropType<EditActivityForm>,
      required: true
    },
    remoteBanner: {
      type: [Object] as PropType<FileDTO>,
      required: true
    },
  },
  emits: ['autosave', 'update:modelValue'],
  template: '<div data-testid="activity-banner-form-field-stub"></div>',
})
