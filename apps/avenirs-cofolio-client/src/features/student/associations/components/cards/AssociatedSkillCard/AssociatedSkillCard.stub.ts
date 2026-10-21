import type { PropType } from 'vue'
import type { SkillProgressDTO } from '@/api/avenir-esr'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const AssociatedSkillCardStub = defineComponent({
  name: 'AssociatedSkillCard',
  props: {
    ...AvInteractivePropsStub,
    declaredSkill: {
      type: Object as PropType<SkillProgressDTO>,
      required: true
    },
  },
  template: '<div data-testid="associated-skill-card"></div>'
})
