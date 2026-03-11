export const FinishDeclaredActivityStub = defineComponent({
  name: 'FinishDeclaredActivity',
  props: ['finishedAt', 'status'],
  emits: ['finished'],
  template: `<div class="finish-declared-activity-stub"></div>`
})
