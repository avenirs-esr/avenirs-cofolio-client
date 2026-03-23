<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import { AvList, AvListItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { trace } = defineProps<{ trace: TraceDetailDTO }>()
const { t } = useI18n()
const declaredSkillAssociations = computed(() => trace.traceAssociations && trace.traceAssociations.declaredSkillAssociations ? trace.traceAssociations.declaredSkillAssociations : [])
</script>

<template>
  <div class="av-col av-gap-md av-p-md">
    <span class="caption-regular">{{ t('student.traces.views.StudentTraceView.updateTraceModal.steps.terms.impactMessage') }}</span>
    <AvList
      size="small"
      role="list"
    >
      <AvListItem
        v-for="declaredSkill in declaredSkillAssociations"
        :key="declaredSkill.id"
        :title="declaredSkill.title"
        :icon="MDI_ICONS.RECORD_CIRCLE_OUTLINE"
        icon-color="var(--dark-background-primary1)"
      />
    </AvList>
    <span class="b2-regular alert-message">{{ t('student.traces.views.StudentTraceView.updateTraceModal.steps.terms.alertMessage') }}</span>
  </div>
</template>

<style lang="scss" scoped>
.alert-message {
  color: var(--light-foreground-error);
}
</style>
