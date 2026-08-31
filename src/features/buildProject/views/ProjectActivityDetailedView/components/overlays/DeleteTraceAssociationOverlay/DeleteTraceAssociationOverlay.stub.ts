export const DeleteTraceAssociationOverlayStub = defineComponent({
  name: 'DeleteTraceAssociationOverlay',
  props: ['trace'],
  emits: ['delete'],
  template: `
    <div class="delete-trace-association-overlay-stub">
      {{ trace?.title }}
      <button @click="$emit('delete', trace?.id)">delete</button>
    </div>
  `
})
