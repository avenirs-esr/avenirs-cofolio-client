export const ActivitiesWidgetStub = defineComponent({
  name: 'ActivitiesWidget',
  props: {
    isNew: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <div :data-testid="\`student-\${isNew ? 'new' : 'library'}-activities-widget\`" />
  `
})
