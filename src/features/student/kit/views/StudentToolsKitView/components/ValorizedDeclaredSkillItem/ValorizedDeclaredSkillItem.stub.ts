import type { PropType } from 'vue'
import type { SkillProgressDTO } from '@/api/avenir-esr'

export const ValorizedDeclaredSkillItemStub = defineComponent({
  name: 'ValorizedDeclaredSkillItem',
  template: '<div data-testid="valorized-declared-skill-item-stub" />',
  props: {
    declaredSkill: { type: Object as PropType<SkillProgressDTO>, required: true }
  }
})
