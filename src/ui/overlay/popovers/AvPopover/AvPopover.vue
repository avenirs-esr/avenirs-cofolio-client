<script lang="ts" setup>
import { usePopover } from '@/ui/overlay/popovers/AvPopover/use-popover'
import { createFocusTrap } from 'focus-trap'
import { type ComponentPublicInstance, nextTick, onBeforeUnmount } from 'vue'

const { width = '12.5rem', padding = 'var(--spacing-md)' } = defineProps<{ width?: string, padding?: string }>()

defineSlots<{
  trigger: (props: {
    toggle: () => void
    triggerRef: HTMLElement | null
  }) => void
  popover: (props: { close: () => void }) => void
}>()

const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

const { showPopover, popoverPosition, togglePopover, closePopover } = usePopover(triggerRef, popoverRef)

let focusTrap: ReturnType<typeof createFocusTrap> | null = null

function setTriggerRef (el: Element | ComponentPublicInstance | null) {
  if (!el) {
    triggerRef.value = null
    return
  }

  if (el instanceof HTMLElement) {
    triggerRef.value = el
    return
  }

  const possibleHTMLElement = (el as any).$el as HTMLElement | undefined

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

    if (popoverRef.value) {
      const focusable = popoverRef.value.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (!focusable) {
        return
      }

      focusTrap = createFocusTrap(popoverRef.value, {
        escapeDeactivates: true,
        onDeactivate: () => closePopover(),
        returnFocusOnDeactivate: true,
        clickOutsideDeactivates: true
      })

      focusTrap.activate()
    }
  }
  else {
    focusTrap?.deactivate()
    triggerRef.value?.focus()
  }
})

onBeforeUnmount(() => {
  focusTrap?.deactivate()
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
        :trigger-ref="triggerRef"
        :toggle="togglePopover"
      />
    </div>

    <Teleport to="body">
      <div
        v-if="showPopover"
        ref="popoverRef"
        tabindex="-1"
        class="av-popover"
        :style="`top: ${popoverPosition.top}px; left: ${popoverPosition.left}px;`"
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
  background: var(--background-dialog);
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
