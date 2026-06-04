<script setup lang="ts">
import type { TraceAssociationsDTO, TraceDetailDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import { AvList, AvListItem } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { associations } = defineProps<{ trace: TraceDetailDTO, associations: TraceAssociationsDTO | undefined }>()
const { t } = useI18n()
const declaredSkillAssociations = computed(() => associations && associations.declaredSkillAssociations ? associations.declaredSkillAssociations : [])
const declaredActivityAssociations = computed(() => associations && associations.declaredActivityAssociations ? associations.declaredActivityAssociations : [])
</script>

<template>
  <div class="av-col av-gap-md av-p-md">
    <span class="caption-regular">{{ t('student.traces.views.StudentUpdateTraceView.steps.terms.impactMessage') }}</span>
    <div v-if="declaredSkillAssociations.length > 0">
      <span class="caption-light">{{ `${t('student.global.myDeclaredSkillCount', { count: declaredSkillAssociations.length })}: ` }}</span>
      <AvList size="small">
        <AvListItem
          v-for="declaredSkillAssociation in declaredSkillAssociations"
          :key="declaredSkillAssociation.associationId"
          :title="declaredSkillAssociation.declaredSkill.title ?? ''"
          :icon="ICONS.SKILLS"
          icon-color="var(--dark-background-primary1)"
        />
      </AvList>
    </div>
    <div v-if="declaredActivityAssociations.length > 0">
      <span class="caption-light">{{ `${t('student.global.myDeclaredActivityCount', { count: declaredActivityAssociations.length })}: ` }}</span>
      <AvList size="small">
        <AvListItem
          v-for="declaredActivityAssociation in declaredActivityAssociations"
          :key="declaredActivityAssociation.associationId"
          :title="declaredActivityAssociation.declaredActivity.title"
          :icon="ICONS.ACTIVITY"
          icon-color="var(--dark-background-primary1)"
        />
      </AvList>
    </div>

    <span class="b2-regular alert-message">{{ t('student.traces.views.StudentUpdateTraceView.steps.terms.alertMessage') }}</span>
  </div>
</template>

<style lang="scss" scoped>
.alert-message {
  color: var(--light-foreground-error);
}
</style>
