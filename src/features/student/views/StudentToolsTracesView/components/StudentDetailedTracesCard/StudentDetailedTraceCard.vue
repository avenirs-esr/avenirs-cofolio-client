<script lang="ts" setup>
import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import { getDaysUntil, parseDateISO } from '@/common/utils'
import { AvCard, AvIconText, AvVIcon, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'
import StudentDetailedTraceModal from '../StudentDetailedTraceModal/StudentDetailedTraceModal.vue'

const { trace } = defineProps<{ trace: TraceViewDTO }>()
const { title, status, deletionDate } = trace

const getDaysUntilDeletion = computed(() => status === TraceStatus.UNASSOCIATED
  ? getDaysUntil(parseDateISO(deletionDate))
  : -1)

const { t } = useI18n()

const showModal = ref(false)
function displayModal () {
  showModal.value = true
}
function hideModal () {
  showModal.value = false
}

const hoverBorderColor = ref('var(--dark-background-primary1)')
</script>

<template>
  <button
    class="student-detailed-trace-card"
    @click="displayModal"
  >
    <AvCard
      border-color="--other-border-skill-card"
      title-background="--dark-background-primary2"
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
              color="var(--background-card)"
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
            icon-color="var(--foreground-text2)"
            text-color="var(--foreground-text2)"
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
  width: 19.75rem;
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
  padding-top: 1.5rem;
  justify-content: flex-end;
}

.student-detailed-trace-card__title {
  position: relative
}

.student-detailed-trace-card__titlecontent {
  display: flex;
  justify-content: flex-start;
  align-items: start;
  align-content: start;
  align-self: flex-start;
  width: 14.688rem;
  height: 3rem;
}

.student-detailed-trace-card__titletruncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  overflow-wrap: break-word;
}

.student-detailed-trace-card__icon {
  position: absolute;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--other-border-skill-card);
  right: 0.75rem;
  top: 2rem;
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
  color: var(--background-card);
}
</style>
