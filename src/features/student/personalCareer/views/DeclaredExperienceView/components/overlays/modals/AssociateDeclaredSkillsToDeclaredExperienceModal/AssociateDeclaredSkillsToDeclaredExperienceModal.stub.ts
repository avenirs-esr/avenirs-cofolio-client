export const AssociateDeclaredSkillsToDeclaredExperienceModalStub = defineComponent({
  name: 'AssociateDeclaredSkillsToDeclaredExperienceModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    declaredExperienceId: {
      type: String,
      required: true
    }
  },
  emits: ['cancel', 'associated'],
  template: `
    <div v-if="show" class="associate-declared-skills-to-declared-experience-modal-stub">
      <p>AssociateDeclaredSkillsToDeclaredExperienceModalStub</p>
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="$emit('associated')">Associated</button>
    </div>
  `
})
