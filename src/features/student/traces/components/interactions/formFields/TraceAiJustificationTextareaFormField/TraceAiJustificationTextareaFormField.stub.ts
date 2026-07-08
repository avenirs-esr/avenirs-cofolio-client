export const TraceAiJustificationTextareaFormFieldStub = defineComponent({
  name: 'TraceAiJustificationTextareaFormField',
  props: {
    form: { type: Object, required: true },
    showAiJustification: { type: Boolean, default: false },
    labelVisible: { type: Boolean, default: true },
  },
  template: '<textarea id="iaJustification" v-if="showAiJustification" />',
})
