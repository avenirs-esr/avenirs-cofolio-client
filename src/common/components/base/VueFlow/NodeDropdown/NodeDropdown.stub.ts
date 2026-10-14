export const NodeDropdownStub = defineComponent({
  name: 'NodeDropdown',
  props: {
    collapsed: { type: Boolean, default: false },
    withProfileUpdate: { type: Boolean, default: false }
  },
  emits: ['update', 'remove', 'collapse', 'updateInProfile'],
  template: `
    <div class="node-dropdown">
      <button
        data-name="update"
        @click="$emit('update')"
      >
        Modifier
      </button>
      <button
        data-name="remove"
        @click="$emit('remove')"
      >
        Supprimer
      </button>
      <button
        v-if="collapsed"
        data-name="collapse"
        @click="$emit('collapse')"
      >
        <span v-if="collapsed">Développer</span>
        <span v-else>Réduire</span>
      </button>
      <button
        v-if="withProfileUpdate"
        data-name="updateInProfile"
        @click="$emit('updateInProfile')"
      >
        Mettre à jour dans mon profil
      </button>
    </div>
  `
})
