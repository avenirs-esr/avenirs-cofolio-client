export const AssociateDeclaredSkillsModalStub = defineComponent({
  name: 'AssociateDeclaredSkillsModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['cancel', 'associated'],
  template: `
    <div v-if="show" class="associate-declared-skills-modal-stub">
      <p>AssociateDeclaredSkillsModalStub</p>
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="$emit('associated')">Associated</button>
    </div>
  `
})
