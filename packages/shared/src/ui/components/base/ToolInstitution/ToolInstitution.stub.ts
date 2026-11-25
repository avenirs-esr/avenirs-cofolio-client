import { defineComponent } from 'vue'

export const ToolInstitutionStub = defineComponent({
  name: 'ToolInstitutionStub',
  props: {
    tool: { type: Object, required: true },
    typographyClass: { type: String }
  },
  template: '<div data-test="tool-institution-stub" />'
})
