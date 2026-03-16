export const MyPerspectiveCardStub = defineComponent({
  name: 'MyPerspectiveCard',
  props: {
    activityId: {
      type: String,
      required: true
    },
    perspective: {
      type: String,
      required: false
    }
  },
  template: '<div class="my-perspective-card" />'
})
