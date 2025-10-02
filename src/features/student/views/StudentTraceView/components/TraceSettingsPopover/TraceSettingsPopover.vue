<script lang="ts" setup>
import { AvButton, AvPopover, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'assignSelected'): void
  (e: 'deleteSelected'): void
  (e: 'updateSelected'): void
}>()

const { t } = useI18n()

const menuItems = computed(() => [
  {
    icon: MDI_ICONS.TRASH_CAN_OUTLINE,
    label: t('student.views.studentTraceView.settings.delete'),
    onClick: () => emit('deleteSelected')
  },
  {
    icon: MDI_ICONS.PLUS_CIRCLE_OUTLINE,
    label: t('student.views.studentTraceView.settings.assign'),
    onClick: () => emit('assignSelected')
  },
  {
    icon: MDI_ICONS.PENCIL_OUTLINE,
    label: t('student.views.studentTraceView.settings.update'),
    onClick: () => emit('updateSelected')
  }
])
</script>

<template>
  <AvPopover
    width="15rem"
    padding="var(--spacing-xs)"
  >
    <template #trigger="{ toggle }">
      <AvButton
        class="settings-btn"
        :icon="{ name: MDI_ICONS.DOTS_VERTICAL }"
        variant="OUTLINED"
        size="sm"
        :label="t('student.views.studentTraceView.settings.ariaLabel').toUpperCase()"
        :on-click="toggle"
      />
    </template>
    <template #popover>
      <div class="container">
        <AvButton
          v-for="menuItem of menuItems"
          :key="menuItem.label"
          class="menu-item"
          :icon="menuItem.icon"
          size="sm"
          theme="SECONDARY"
          :label="menuItem.label"
          :aria-label="menuItem.label"
          :icon-scale="1.3"
          no-radius
          @click="menuItem.onClick"
        />
      </div>
    </template>
  </AvPopover>
</template>

<style lang="scss" scoped>
.settings-menu {
  position: absolute;
  top: 4.2rem;
  right: var(--spacing-xxs);
  background: var(--dialog);
  border: 0.06rem solid var(--dark-background-primary2);
  border-radius: var(--radius-lg);
  box-shadow: 0 var(--spacing-xxs) var(--spacing-xs) rgba(0, 0, 0, 0.15);
  z-index: 20000;
  min-width: 14.688rem;
  padding:  var(--spacing-xs) var(--spacing-none);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
}

.menu-item {
  display: flex;
  width: 100% !important;
  align-items: center;
  align-self: stretch;

  &:first-child {
    border-radius: var(--radius-sm) var(--radius-sm) 0 0 !important;
  }

  &:last-child {
    border-radius: 0 0 var(--radius-sm) var(--radius-sm) !important;
  }
}
</style>
