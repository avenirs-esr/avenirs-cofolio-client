import type { DeclaredSkillCategoryDTO, EExternalSkillType } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeclaredSkillRefCardStub = defineComponent({
  name: 'DeclaredSkillRefCard',
  props: {
    type: String as PropType<EExternalSkillType>,
    pathSegments: Array as PropType<DeclaredSkillCategoryDTO[]>
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
