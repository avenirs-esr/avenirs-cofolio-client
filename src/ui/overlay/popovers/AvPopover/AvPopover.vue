<script lang="ts" setup>
import { useFocusTrap } from '@/ui/composables'
import { usePopover } from '@/ui/overlay/popovers/AvPopover/use-popover'
import { type ComponentPublicInstance, nextTick, onBeforeUnmount } from 'vue'

/**
 * AvPopover component props.
 */
interface AvPopoverProps {
  /**
   * Popover width.
   * @default '12.5rem'
   */
  width?: string

  /**
   * Internal popover padding.
   * @default 'var(--spacing-md)'
   */
  padding?: string
}

withDefaults(defineProps<AvPopoverProps>(), {
  width: '12.5rem',
  padding: 'var(--spacing-md)'
})

defineSlots<{
  /**
   * Slot for the popover trigger.
   * Provides the prop:
   * - toggle: function to open/close the popover
   */
  trigger: (props: {
    toggle: () => void
  }) => void

  /**
   * Slot for the popover content.
   * Provides the prop:
   * - close: function to close the popover
   */
  popover: (props: { close: () => void }) => void
}>()

const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

const { showPopover, popoverPosition, togglePopover, closePopover } = usePopover(triggerRef, popoverRef)
const { initializeFocusTrap, cleanupFocusTrap } = useFocusTrap(popoverRef, closePopover)

function setTriggerRef (el: Element | ComponentPublicInstance | null) {
  if (!el) {
    triggerRef.value = null
    return
  }

  if (el instanceof HTMLElement) {
    triggerRef.value = el
    return
  }

  const possibleHTMLElement = (el as ComponentPublicInstance<{ $el: HTMLElement }>).$el

  if (possibleHTMLElement instanceof HTMLElement) {
    triggerRef.value = possibleHTMLElement
  }
  else {
    triggerRef.value = null
  }
}

defineExpose({ setTriggerRef, triggerRef })

watch(showPopover, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    initializeFocusTrap()
  }
  else {
    cleanupFocusTrap()
  }
})

onBeforeUnmount(() => {
  cleanupFocusTrap()
})
</script>

<template>
  <div class="av-popover-wrapper">
    <div
      :ref="setTriggerRef"
      class="av-popover-trigger-wrapper"
    >
      <slot
        name="trigger"
        :toggle="togglePopover"
      />
    </div>

    <Teleport to="body">
      <div
        v-if="showPopover"
        ref="popoverRef"
        tabindex="-1"
        class="av-popover"
        :style="`top: ${popoverPosition.top}rem; left: ${popoverPosition.left}rem;`"
        @keydown.esc.prevent="closePopover"
      >
        <slot
          name="popover"
          :close="closePopover"
        />
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.av-popover-wrapper {
  display: flex;
}

.av-popover-trigger-wrapper {
  display: flex;
  flex: 1;
}

.av-popover {
  position: absolute;
  background: var(--dialog);
  border: 1px solid var(--dark-background-primary2);
  border-radius: var(--radius-lg);
  box-shadow: 0 var(--spacing-xxs) var(--spacing-xs) rgba(0, 0, 0, 0.15);
  z-index: 9999;
  width: v-bind('width');
  padding: v-bind('padding');
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
