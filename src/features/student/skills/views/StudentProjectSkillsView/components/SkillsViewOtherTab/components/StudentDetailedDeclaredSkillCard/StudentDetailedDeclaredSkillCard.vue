<script lang="ts" setup>
import type { DeclaredSkillProgressDTO, ExternalSkillDTO } from '@/api/avenir-esr'
import ValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
import { ROUTES } from '@/common/constants'
import { DeclaredSkillMacroSkillBadge } from '@/features/student/declaredSkills'
import StudentDetailedSkillCard from '@/features/student/skills/components/cards/StudentDetailedSkillCard/StudentDetailedSkillCard.vue'
import { AvBadge, type AvBadgeProps, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface StudentDetailedDeclaredSkillCardProps {
  declaredSkill: ExternalSkillDTO | DeclaredSkillProgressDTO
}

const { declaredSkill } = defineProps<StudentDetailedDeclaredSkillCardProps>()
const { t } = useI18n()
const declaredSkillColor = 'var(--dark-background-primary1)'
const typeBadge = computed<AvBadgeProps>(() => ({
  label: t(`student.declaredSkills.declaredSkillTypes.${declaredSkill.type}`),
  color: 'var(--text1)',
  borderColor: 'var(--other-border-skill-card)',
  backgroundColor: 'var(--surface-background)',
  icon: ICONS_DATA_URL.MDI_BOOKMARK_CHECK
}))
const valorized = computed(() =>
  'valorized' in declaredSkill ? declaredSkill.valorized : false
)
</script>

<template>
  <StudentDetailedSkillCard
    :id="declaredSkill.id"
    :name="declaredSkill.title"
    :skill-color="declaredSkillColor"
    :icon="MDI_ICONS.STARS"
    :to="ROUTES.STUDENT.PROJECT_DECLARED_SKILL.name"
    color="var(--card2)"
  >
    <div class="av-col av-justify-between av--mt-xs av-gap-xxs">
      <div class="av-pr-5xl">
        <div class="av-col av-gap-sm">
          <div class="av-row av-w-full av-align-center av-justify-between av-gap-sm av-wrap">
            <AvBadge
              v-bind="typeBadge"
              small
              ellipsis
            />

            <ValorizedBadge :valorized="valorized" />
          </div>

          <DeclaredSkillMacroSkillBadge
            v-if="declaredSkill.pathSegments.length > 0"
            :path-segments="declaredSkill.pathSegments"
          />
        </div>
      </div>
    </div>
  </StudentDetailedSkillCard>
</template>

<style lang="scss" scoped>
:deep(.av-card){
  justify-content: flex-start;
}
</style>
