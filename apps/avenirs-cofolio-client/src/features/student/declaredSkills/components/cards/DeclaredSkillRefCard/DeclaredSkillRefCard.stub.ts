import type { PropType } from 'vue'
import type { ESkillReferentialType, SkillPathSegmentDTO } from '@/api/avenir-esr'

export const DeclaredSkillRefCardStub = defineComponent({
  name: 'DeclaredSkillRefCard',
  props: {
    type: String as PropType<ESkillReferentialType>,
    pathSegments: Array as PropType<SkillPathSegmentDTO[]>
  },
  template: `
    <div data-testid="declared-skill-ref-card">
      <span data-testid="declared-skill-ref-card-type">{{ type }}</span>
      <span v-for="(segment, index) in pathSegments" :key="index" data-testid="declared-skill-ref-card-path-segments">
        {{ segment.libelle }}
      </span>
    </div>
  `
})
