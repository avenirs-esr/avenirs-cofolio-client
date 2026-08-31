export const DeleteDeclaredSkillConfirmModalStub = defineComponent({
  name: 'DeleteDeclaredSkillConfirmModal',
  props: {
    show: {
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
  template: `<div v-if="show">
    <p>DeleteDeclaredSkillConfirmModalStub for skill: {{ skillTitle }} (ID: {{ skillId }})</p>
    <button @click="$emit('close')">Close</button>
  </div>`
})
