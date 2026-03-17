export const AssociateTracesModalStub = defineComponent({
  name: 'AssociateTracesModal',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  emits: ['cancel', 'associate'],
  template: `
    <div v-if="show" class="associate-traces-modal-stub">
      <p>AssociateTracesModalStub</p>
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="$emit('associate')">Associate</button>
    </div>
  `
})
