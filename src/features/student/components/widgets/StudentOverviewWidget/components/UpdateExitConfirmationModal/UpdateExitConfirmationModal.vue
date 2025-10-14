<script setup lang="ts">
import { AvModal } from '@avenirs-esr/avenirs-dsav'
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
    :confirm-button-label="t('global.buttons.confirm')"
    :is-loading="isLoading"
    @close="onCancel"
    @confirm="onConfirm"
  >
    <h5 class="n5">
      {{ t('student.widgets.overview.updateProfileDrawer.confirmModal.title') }}
    </h5>
    <span class="b2-regular">
      {{ t('student.widgets.overview.updateProfileDrawer.confirmModal.subtitle') }}
    </span>
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
