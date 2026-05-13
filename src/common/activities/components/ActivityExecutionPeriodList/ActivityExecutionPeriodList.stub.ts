export const ActivityExecutionPeriodListStub
  = defineComponent({
    name: 'ActivityExecutionPeriodListStub',
    props: {
      executionPeriodInfo: {
        type: String,
        required: true
      }
    },
    template: `
      <ul data-testid="activity-execution-period">
        <li>{{ executionPeriodInfo }}</li>
      </ul>
    `
  })
