export const TraceLinkInputFormFieldStub = defineComponent({
  name: 'TraceLinkInputFormField',
  template: `<div class="trace-link-input-form-field"/>`,
  props: ['form'],
  emits: ['update:modelValue', 'blur']
})
