<script lang="ts" setup>
import type { DeclaredSkillProgressDTO } from '@/api/avenir-esr'
import { EExternalSkillType } from '@/api/avenir-esr'
import { DeclaredSkillLevelBadge, DeclaredSkillMacroSkillBadge, DeclaredSkillTypeBadge } from '@/features/declaredSkills'
import { ValorizedItemType } from '@/features/kit/types/valorized.types'
import ValorizedItem from '@/features/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'
import { useI18n } from 'vue-i18n'

export interface ValorizedDeclaredSkillItemProps {
  declaredSkill: DeclaredSkillProgressDTO
}

const { declaredSkill } = defineProps<ValorizedDeclaredSkillItemProps>()

const { t } = useI18n()

const isMacroSkillDisplayed = computed(() => declaredSkill.type === EExternalSkillType.ROME4 && declaredSkill.pathSegments.length > 0)
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
      <DeclaredSkillMacroSkillBadge
        v-if="isMacroSkillDisplayed"
        :path-segments="declaredSkill.pathSegments"
      />
    </div>
  </ValorizedItem>
</template>
