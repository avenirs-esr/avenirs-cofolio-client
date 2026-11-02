export const FinishDeclaredActivityStub = defineComponent({
  name: 'FinishDeclaredActivity',
  props: ['status', 'isLoading', 'assessmentEnabled'],
  emits: ['finished'],
  template: `<div class="finish-declared-activity-stub"></div>`
})
