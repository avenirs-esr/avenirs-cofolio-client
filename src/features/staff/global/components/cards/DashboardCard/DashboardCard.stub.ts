export const DashboardCardStub = defineComponent({
  name: 'DashboardCard',
  props: ['icon', 'value', 'label'],
  template: `
    <div data-testid="dashboard-card">
      <div data-testid="dashboard-card-value">{{ value }}</div>
      <div data-testid="dashboard-card-label">{{ label }}</div>
    </div>
  `,
})
