<script setup lang="ts">
import type { TraceDeclaredActivityDTO } from '@/api/avenir-esr'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import { ConfirmationModal } from '@/common/components'
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ConfirmUpdateTraceModalProps {
  show: boolean
  lockedDeclaredActivities: TraceDeclaredActivityDTO[]
}

const {
  show,
  lockedDeclaredActivities
} = defineProps<ConfirmUpdateTraceModalProps>()

defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

const { t } = useI18n()
</script>

<template>
  <ConfirmationModal
    :show="show"
    :confirm-button-label="t('student.traces.views.StudentUpdateTraceView.ConfirmUpdateTraceModal.confirmLabel')"
    :title="t('student.traces.views.StudentUpdateTraceView.ConfirmUpdateTraceModal.emptyTitle')"
    :show-description="false"
    data-testid="confirm-update-trace-modal"
    @close="$emit('cancel')"
    @confirm="$emit('confirm')"
  >
    <template
      v-if="lockedDeclaredActivities.length > 0"
      #default
    >
      <div
        class="av-col av-gap-sm"
      >
        <div class="av-col av-gap-xxs av-text-center">
          <span
            class="n5"
            data-testid="confirm-update-trace-modal-title"
          >
            {{ t('student.traces.views.StudentUpdateTraceView.ConfirmUpdateTraceModal.title') }}
          </span>
          <span
            class="av-text-error"
            data-testid="confirm-update-trace-modal-subtitle"
          >
            {{ t('student.traces.views.StudentUpdateTraceView.ConfirmUpdateTraceModal.subtitle') }}
          </span>
        </div>
        <div
          class="av-col av-gap-sm av-px-lg--md"
          data-testid="confirm-update-trace-modal-associations"
        >
          <div
            v-for="declaredActivity in lockedDeclaredActivities"
            :key="declaredActivity.activityId!"
            class="av-row av-gap-xs av-align-center"
          >
            <AvIcon
              :name="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
              :size="1.5"
              color="var(--text2)"
            />
            <span class="av-text-text2">{{ declaredActivity.activityTitle! }}</span>
            <DeclaredActivityStatusBadge :status="declaredActivity.activityStatus!" />
          </div>
        </div>
      </div>
    </template>
  </ConfirmationModal>
</template>
