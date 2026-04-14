export const AssociateDeclaredSkillsToActivityModalStub = defineComponent({
  name: 'AssociateDeclaredSkillsToActivityModal',
  props: {
    show: { type: Boolean, required: true },
    activityId: { type: String, required: true },
  },
  emits: ['cancel', 'associated'],
  template: `
    <div v-if="show" data-testid="associate-declared-skills-to-activity-modal-stub">
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="$emit('associated')">Associated</button>
    </div>
  `
})
