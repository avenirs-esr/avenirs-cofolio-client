import type { AvCancelConfirmButtonsProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'

export const DrawerStub = defineComponent({
  name: 'Drawer',
  props: {
    show: Boolean,
    position: String as PropType<'left' | 'right'>,
    width: String,
    backdrop: Boolean,
    padding: String,
    ariaLabel: String,
    confirmLabel: String,
    confirmCancelProps: Object as PropType<Partial<AvCancelConfirmButtonsProps>>,
    closeOnClickOutside: Boolean
  },
  emits: ['close', 'confirm'],
  template: '<div data-testid="drawer-stub"><slot /><slot name="footer" /></div>'
})
