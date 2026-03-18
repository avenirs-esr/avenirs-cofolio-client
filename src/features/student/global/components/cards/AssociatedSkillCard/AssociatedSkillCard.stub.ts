export const AssociatedSkillCardStub = defineComponent({
  name: 'AssociatedSkillCard',
  props: {
    title: {
      type: String,
      required: true
    },
    to: {
      type: [String, Object],
      required: true
    }
  },
  template: '<div data-testid="associated-skill-card"></div>'
})
