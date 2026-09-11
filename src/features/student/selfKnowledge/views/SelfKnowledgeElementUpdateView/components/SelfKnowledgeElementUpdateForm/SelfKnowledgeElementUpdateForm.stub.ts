export const SelfKnowledgeElementUpdateFormStub = defineComponent({
  name: 'SelfKnowledgeElementUpdateForm',
  props: {
    element: {
      type: Object,
      required: true
    },
    onCancel: {
      type: Function,
      required: false
    }
  },
  template: '<div class="self-knowledge-element-update-form-stub" />'
})
