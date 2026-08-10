import type { TraceAssociationDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'

export const DeclaredExperienceAssociationsStub = defineComponent({
  name: 'DeclaredExperienceAssociations',
  props: {
    declaredExperienceId: {
      type: String,
      required: true
    },
    traceAssociations: {
      type: Array as () => TraceAssociationDTO[],
      required: true
    },
    associationsError: {
      type: Object as () => BaseApiException | null,
      required: false
    }
  },
  template: `
    <div
      class="declared-experience-associations-stub"
      data-testid="declared-experience-associations-stub"
    />
  `
})
