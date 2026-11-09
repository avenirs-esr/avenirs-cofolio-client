import type { SkillProgressDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'
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
