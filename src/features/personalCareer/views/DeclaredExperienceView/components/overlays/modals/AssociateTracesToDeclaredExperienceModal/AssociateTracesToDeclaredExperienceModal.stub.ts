export const AssociateTracesToDeclaredExperienceModalStub = defineComponent({
  name: 'AssociateTracesToDeclaredExperienceModal',
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
    <div v-if="show" class="associate-traces-to-declared-experience-modal-stub">
      <p>AssociateTracesToDeclaredExperienceModalStub</p>
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="$emit('associated')">Associated</button>
    </div>
  `
})
