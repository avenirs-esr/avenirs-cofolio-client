export const SelfKnowledgeElementsSideMenuStub = defineComponent({
  name: 'SelfKnowledgeElementsSideMenu',
  props: {
    elements: {
      type: Array,
      required: true
    },
    categoryType: {
      type: String,
      required: true
    },
    selectedElementId: {
      type: String,
      required: true
    }
  },
  emits: ['selectElement'],
  template: '<div class="self-knowledge-elements-side-menu-stub" />'
})
