export const TracePersonalNoteTextareaFormFieldStub = defineComponent({
  name: 'TracePersonalNoteTextareaFormField',
  props: {
    form: { type: Object, required: true },
  },
  template: '<textarea id="personalNote" />',
})
