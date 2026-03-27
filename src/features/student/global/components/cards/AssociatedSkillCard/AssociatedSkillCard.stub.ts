import type { DeclaredSkillProgressDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const AssociatedSkillCardStub = defineComponent({
  name: 'AssociatedSkillCard',
  props: {
    declaredSkill: {
      type: Object as PropType<DeclaredSkillProgressDTO>,
      required: true
    }
  },
  template: '<div data-testid="associated-skill-card"></div>'
})
