<script lang="ts" setup>
import type { DeclaredSkillProgressDTO } from '@/api/avenir-esr'
import { DeclaredSkillLevelBadge, DeclaredSkillTypeBadge } from '@/features/student/declaredSkills'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import ValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import { useI18n } from 'vue-i18n'

export interface ValorizedDeclaredSkillItemProps {
  declaredSkill: DeclaredSkillProgressDTO
}

const { declaredSkill } = defineProps<ValorizedDeclaredSkillItemProps>()

const { t } = useI18n()
</script>

<template>
  <ValorizedItem
    :title="declaredSkill.title"
    :item-id="declaredSkill.id"
    :type="ValorizedItemType.DECLARED_SKILL"
  >
    <div class="av-row av-align-center av-wrap av-gap-xs">
      <DeclaredSkillTypeBadge :label="t(`student.declaredSkills.declaredSkillTypes.${declaredSkill.type}`)" />
      <DeclaredSkillLevelBadge
        :level="declaredSkill.level"
        small
      />
    </div>
  </ValorizedItem>
</template>
