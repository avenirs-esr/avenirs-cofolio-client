import type { TraceAssociationsDTO, TraceDetailDTO } from '@/api/avenir-esr'
import type { UpdateTraceForm as UpdateTraceFormApi } from '@/features/student/traces/types/forms.types'
import type { PropType } from 'vue'

export const UpdateTabsStub = defineComponent({
  name: 'UpdateTabs',
  props: {
    trace: Object as PropType<TraceDetailDTO>,
    associations: Object as PropType<TraceAssociationsDTO>,
    form: Object as PropType<UpdateTraceFormApi>
  },
  template: '<div data-testid="update-tabs" />'
})
