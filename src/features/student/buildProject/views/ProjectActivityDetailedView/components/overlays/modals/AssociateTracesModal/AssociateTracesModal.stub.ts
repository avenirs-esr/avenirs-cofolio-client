export const AssociateTracesModalStub = defineComponent({
  name: 'AssociateTracesModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['cancel', 'associated'],
  template: `
    <div v-if="show" class="associate-traces-modal-stub">
      <p>AssociateTracesModalStub</p>
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="$emit('associated')">Associated</button>
    </div>
  `
})
