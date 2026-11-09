import type { SkillProgressDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const ValorizedDeclaredSkillItemStub = defineComponent({
  name: 'ValorizedDeclaredSkillItem',
  template: '<div data-testid="valorized-declared-skill-item-stub" />',
  props: {
    declaredSkill: { type: Object as PropType<SkillProgressDTO>, required: true }
  }
})
