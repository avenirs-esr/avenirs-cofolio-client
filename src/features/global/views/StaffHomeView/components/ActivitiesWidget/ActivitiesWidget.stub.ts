export const ActivitiesWidgetStub = defineComponent({
  name: 'ActivitiesWidget',
  props: {
    isDraft: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <div :data-testid="\`\${isDraft ? 'draft' : 'published'}-activities-widget\`" />
  `
})
