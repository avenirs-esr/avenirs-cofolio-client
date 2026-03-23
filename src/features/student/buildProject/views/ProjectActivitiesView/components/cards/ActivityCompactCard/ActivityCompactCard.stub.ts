export const ActivityCompactCardStub = defineComponent({
  name: 'ActivityCompactCard',
  props: ['activity'],
  template: '<div class="activity-compact-card-stub">{{ activity?.title }}</div>'
})
