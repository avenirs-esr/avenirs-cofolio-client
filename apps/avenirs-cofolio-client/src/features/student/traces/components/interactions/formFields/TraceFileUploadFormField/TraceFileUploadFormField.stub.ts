export const TraceFileUploadFormFieldStub = defineComponent({
  name: 'TraceFileUploadFormField',
  props: {
    form: { type: Object, required: true },
    label: { type: String, default: '' },
  },
  emits: ['file-selected', 'file-deleted'],
  template: '<input id="trace-file-upload" type="file" />',
})
