<script lang="ts" setup>
import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import { getDaysUntil, parseDateISO } from '@/common/utils'
import StudentDetailedTraceModal from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceModal/StudentDetailedTraceModal.vue'
import { AvCard, AvIconText, AvVIcon, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { trace } = defineProps<{ trace: TraceViewDTO }>()
const { title, status, deletedAt } = trace

const getDaysUntilDeletion = computed(() => status === TraceStatus.UNASSOCIATED
  ? getDaysUntil(parseDateISO(deletedAt))
  : -1)

const { t } = useI18n()

const { showModal, displayModal, hideModal } = useModal()

const hoverBorderColor = ref('var(--dark-background-primary1)')
</script>

<template>
  <button
    class="student-detailed-trace-card"
    @click="displayModal"
  >
    <AvCard
      border-color="var(--other-border-skill-card)"
      title-background="var(--dark-background-primary2)"
      title-height="4.375rem"
    >
      <template #title>
        <div class="student-detailed-trace-card__title">
          <span class="b1-bold student-detailed-trace-card__titletruncate">
            {{ title }}
          </span>
          <div
            class="student-detailed-trace-card__icon"
            :style="{ background: 'var(--dark-background-primary2)' }"
          >
            <AvVIcon
              :name="MDI_ICONS.ATTACH_FILE"
              color="var(--card)"
              :size="1.938"
            />
          </div>
        </div>
      </template>
      <template #body>
        <div class="student-detailed-trace-card__body">
          <AvIconText
            v-if="getDaysUntilDeletion > 0"
            :icon="MDI_ICONS.HOURGLASS"
            :text="t('student.views.studentToolsTracesView.studentDetailedTraceCard.getDaysUntilDeletion', { count: getDaysUntilDeletion })"
            icon-color="var(--text2)"
            text-color="var(--text2)"
            typography-class="b2-regular"
            gap="0.75rem"
          />
        </div>
      </template>
    </AvCard>
  </button>
  <StudentDetailedTraceModal
    :trace="trace"
    :show-modal="showModal"
    :on-close="hideModal"
  />
</template>

<style lang="scss" scoped>
.student-detailed-trace-card {
  display: flex;
  width: 17.75rem;
  height: 14rem;
  border-radius: 1.5rem;
  text-align: left;
  padding: 0;
}

.av-card {
  height: 14rem;
  width: 100%;
}

.av-card:hover {
  border: 1px solid v-bind('hoverBorderColor') !important;
  box-shadow: 0 0 0 2px v-bind('hoverBorderColor');
}

.student-detailed-trace-card__body {
  padding-top: var(--spacing-md);
  justify-content: flex-end;
}

.student-detailed-trace-card__title {
  position: relative;
}

.student-detailed-trace-card__titlecontent {
  display: flex;
  justify-content: flex-start;
  align-items: start;
  align-content: start;
  align-self: flex-start;
  width: 14.688rem;
  height: var(--dimension-2xl);
}

.student-detailed-trace-card__titletruncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: var(--dimension-2xl);
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  overflow-wrap: break-word;
}

.student-detailed-trace-card__icon {
  position: absolute;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--other-border-skill-card);
  right: 0.75rem;
  top: var(--spacing-lg);
  display: flex;
  justify-content: center;
  align-items: center;
}

.student-detailed-trace-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.b1-bold {
  color: var(--card);
}
</style>
