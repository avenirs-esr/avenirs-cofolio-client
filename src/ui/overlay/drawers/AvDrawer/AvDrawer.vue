<script setup lang="ts">
export interface AvDrawerProps {
  /**
   * Controls the visibility of the drawer
   */
  show: boolean
  /**
   * Position of the drawer on the screen
   */
  position?: 'left' | 'right'
  /**
   * Width of the drawer panel
   */
  width?: string
  /**
   * Whether to show the backdrop overlay, default true
   */
  backdrop?: boolean
  /**
   * Padding inside the drawer content area
   */
  padding?: string
}

const props = withDefaults(defineProps<AvDrawerProps>(), {
  position: 'right',
  width: '35rem',
  backdrop: true,
  padding: 'var(--spacing-md)'
})

const { position, width, padding } = toRefs(props)
</script>

<template>
  <div v-if="show">
    <div
      v-if="backdrop"
      class="av-drawer-backdrop"
    />
    <div
      class="av-drawer"
      :class="`av-drawer--${position}`"
    >
      <div class="av-drawer__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.av-drawer-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--transparency);
  z-index: 999;
}

.av-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: var(--dialog);
  border: 0.06rem solid var(--surface-background);
  overflow: hidden;
  z-index: 1000;
  padding: var(--spacing-xl);
  width: v-bind('width')
}

.av-drawer--left {
  left: 0;
  border-radius: 0 var(--radius-hg) var(--radius-hg) 0;
  box-shadow: -0.125rem 0 0.625rem 0 #0000001A;
}

.av-drawer--right {
  right: 0;
  border-radius: var(--radius-hg) 0 0 var(--radius-hg);
  box-shadow: 0.125rem 0 0.625rem 0 #0000001A;
}

.av-drawer__content {
  padding: v-bind('padding');
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;
}
</style>
