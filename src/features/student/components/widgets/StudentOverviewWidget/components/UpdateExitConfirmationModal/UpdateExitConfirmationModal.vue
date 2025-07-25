<script setup lang="ts">
import { AvButton, AvModal, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { showModal, isLoading, onCancel, onConfirm } = defineProps<{
  showModal: boolean
  isLoading: boolean
  onCancel: () => void
  onConfirm: () => void
}>()

const { t } = useI18n()
</script>

<template>
  <AvModal
    :opened="showModal"
    :close-button-label="t('global.buttons.cancel')"
    :is-loading="isLoading"
    @close="onCancel"
  >
    <h5 class="n5">
      {{ t('student.widgets.overview.updateProfileDrawer.confirmModal.title') }}
    </h5>
    <span class="b2-regular">
      {{ t('student.widgets.overview.updateProfileDrawer.confirmModal.subtitle') }}
    </span>
    <template #footer>
      <AvButton
        :icon="MDI_ICONS.CHECK_CIRCLE_OUTLINE"
        :label="t('global.buttons.confirm')"
        :title="t('global.buttons.confirm')"
        :is-loading="isLoading"
        variant="FLAT"
        theme="PRIMARY"
        size="sm"
        :on-click="onConfirm"
      />
    </template>
  </AvModal>
</template>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--spacing-xl);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-sm);
}

.caption-light, .caption-bold {
  color: var(--text2);
}

.b2-bold {
  color: var(--text1);
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
