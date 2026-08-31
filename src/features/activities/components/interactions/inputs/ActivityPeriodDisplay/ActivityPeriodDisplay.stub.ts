export const ActivityPeriodDisplayStub = defineComponent({
  name: 'ActivityPeriodDisplayStub',

  props: {
    startDate: {
      type: String,
      required: false
    },

    endDate: {
      type: String,
      required: false
    }
  },

  template: `
    <div data-testid="activity-period-display">
      <span data-testid="start-date">
        {{ startDate }}
      </span>

      <span data-testid="end-date">
        {{ endDate }}
      </span>
    </div>
  `
})
