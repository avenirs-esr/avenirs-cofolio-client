export const DeleteOverlayStub = defineComponent({
  name: 'DeleteOverlay',
  emits: ['delete'],
  template: `
    <div class="delete-overlay-stub">
      <slot />
      <button @click="$emit('delete')">delete</button>
    </div>
  `
})
