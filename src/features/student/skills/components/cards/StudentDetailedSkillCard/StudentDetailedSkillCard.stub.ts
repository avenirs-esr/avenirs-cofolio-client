export const StudentDetailedSkillCardStub = defineComponent({
  name: 'StudentDetailedSkillCard',
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    skillColor: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    compact: {
      type: Boolean,
      required: false
    }
  },
  template: `<div data-testid="student-detailed-skill-card-stub"></div>`
})
