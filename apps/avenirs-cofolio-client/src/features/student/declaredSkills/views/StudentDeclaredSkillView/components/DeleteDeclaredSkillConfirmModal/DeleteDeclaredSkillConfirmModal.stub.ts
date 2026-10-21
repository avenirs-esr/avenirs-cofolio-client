export const DeleteDeclaredSkillConfirmModalStub = defineComponent({
  name: 'DeleteDeclaredSkillConfirmModal',
  props: {
    opened: {
      type: Boolean,
      required: true
    },
    skillTitle: {
      type: String,
      required: true
    },
    skillId: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'skillDeleted'],
  template: `<div v-if="opened">
    <p>DeleteDeclaredSkillConfirmModalStub for skill: {{ skillTitle }} (ID: {{ skillId }})</p>
    <button @click="$emit('close')">Close</button>
  </div>`
})
