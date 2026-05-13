export const ActivityDescriptionContentStub = defineComponent({
  name: 'ActivityDescriptionContent',

  props: {
    description: {
      type: String,
      required: false
    }
  },

  template: `
    <div data-testid="activity-description">
      {{ description }}
    </div>
  `
})
