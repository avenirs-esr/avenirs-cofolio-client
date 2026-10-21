import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const DeleteOverlayStub = defineComponent({
  name: 'DeleteOverlay',
  props: { ...AvInteractivePropsStub },
  emits: ['delete'],
  template: `
    <div
      class="delete-overlay-stub"
      data-testid="delete-overlay-stub"
    >
      <slot />
      <button @click="$emit('delete')">delete</button>
    </div>
  `
})
