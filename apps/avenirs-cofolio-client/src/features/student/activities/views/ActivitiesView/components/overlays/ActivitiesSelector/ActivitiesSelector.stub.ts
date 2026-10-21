export const ActivitiesSelectorStub = defineComponent({
  name: 'ActivitiesSelectorStub',
  props: ['activities', 'readonly', 'modelValue'],
  emits: ['update:modelValue'],
  template: `<div class="activities-selector-stub"></div>`
})
