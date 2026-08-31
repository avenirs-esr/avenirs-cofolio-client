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
    },
    countElements: {
      type: Number,
      default: 0
    }
  },
  emits: ['selectElement', 'loadMoreElements'],
  template: '<div class="self-knowledge-elements-side-menu-stub" />'
})
