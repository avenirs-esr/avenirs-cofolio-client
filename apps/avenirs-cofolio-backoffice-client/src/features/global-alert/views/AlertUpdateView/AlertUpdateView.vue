<script setup lang="ts">
import { ConfirmationModal, QuerySuspense, UpdatePageTitle, useModal, useUnsavedChangesGuard } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { useGetAlertConfig } from '@/api/avenir-esr'
import AlertUpdateForm from '@/features/global-alert/views/AlertUpdateView/components/forms/AlertUpdateForm/AlertUpdateForm.vue'

const { t } = useI18n()
const router = useRouter()
const { modalOpened, openModal, closeModal } = useModal()
const { data: alert, isLoading, error } = useGetAlertConfig()

const isDirty = ref(false)
const { confirm, cancel } = useUnsavedChangesGuard({ isDirty, openModal, closeModal })

const title = computed(() => t('global-alert.entityName'))

function navigateBack () {
  router.back()
}

function handleDirtyChange (value: boolean) {
  isDirty.value = value
}

function handleAlertUpdated () {
  isDirty.value = false
  navigateBack()
}
</script>

<template>
  <UpdatePageTitle :title="title" />

  <div class="av-col av-gap-sm">
    <QuerySuspense
      :error
      :is-loading
    >
      <AlertUpdateForm
        :alert
        @dirty-change="handleDirtyChange"
        @alert-updated="handleAlertUpdated"
        @cancel="navigateBack"
      />
    </QuerySuspense>
  </div>

  <ConfirmationModal
    :opened="modalOpened"
    :description="t('global-alert.views.AlertUpdateView.guardDescription')"
    @close="cancel"
    @confirm="confirm"
  />
</template>
