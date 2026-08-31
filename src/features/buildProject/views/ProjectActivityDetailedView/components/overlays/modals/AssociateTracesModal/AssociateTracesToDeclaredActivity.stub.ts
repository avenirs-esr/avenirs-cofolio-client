export const AssociateTracesToDeclaredActivityStub = defineComponent({
  name: 'AssociateTracesToDeclaredActivity',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    declaredActivityId: {
      type: String,
      required: true
    }
  },
  emits: ['cancel', 'associated'],
  template: `
    <div v-if="show" class="associate-traces-to-declared-activity-stub">
      <p>AssociateTracesToDeclaredActivityStub</p>
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="$emit('associated')">Associated</button>
    </div>
  `
})
