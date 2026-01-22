<script lang="ts" setup>
import type { DeclaredSkillAssociationDTO } from '@/api/avenir-esr'
import DeclaredSkillLevelBadge from '@/features/student/declaredSkills/components/badges/DeclaredSkillLevelBadge/DeclaredSkillLevelBadge.vue'
import DeclaredSkillTypeBadge from '@/features/student/declaredSkills/components/badges/DeclaredSkillTypeBadge/DeclaredSkillTypeBadge.vue'
import StudentTraceAssociationCard from '@/features/student/traces/components/cards/StudentTraceAssociationCard/StudentTraceAssociationCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentTraceDeclaredSkillAssociationCardProps {
  declaredSkill: DeclaredSkillAssociationDTO
}

defineProps<StudentTraceDeclaredSkillAssociationCardProps>()

const { t } = useI18n()
</script>

<template>
  <StudentTraceAssociationCard
    :title="declaredSkill.title"
    :icon="MDI_ICONS.STARS"
  >
    <template #title-prepend>
      <div class="av-row av-align-center av-gap-md">
        <DeclaredSkillTypeBadge
          :label="t(`student.declaredSkills.declaredSkillTypes.${declaredSkill.type}`)"
        />
        <DeclaredSkillLevelBadge
          :level="declaredSkill.level"
          small
        />
      </div>
    </template>
    <template #body>
      <slot name="body" />
    </template>
  </StudentTraceAssociationCard>
</template>
