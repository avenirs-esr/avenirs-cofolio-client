export const AssociateDeclaredSkillsToTracesModalStub = defineComponent({
  name: 'AssociateDeclaredSkillsToTracesModal',
  props: {
    show: { type: Boolean, required: true },
    traceId: { type: String, required: true },
  },
  emits: ['cancel', 'associated'],
  template: `
    <div v-if="show" data-testid="associate-declared-skills-to-traces-modal-stub">
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="$emit('associated')">Associated</button>
    </div>
  `
})
