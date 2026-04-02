<script setup lang="ts">
import type { SkillDetailedDTO } from '@/api/avenir-esr'
import type { SectionNavigationItem } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import type { Component } from 'vue'
import SectionNavigationLayout
  from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.vue'
import StudentSkillDetailedSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillDetailedSection/StudentSkillDetailedSection.vue'
import StudentSkillEvaluateSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillEvaluateSection/StudentSkillEvaluateSection.vue'
import StudentSkillLevelDetailedSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillLevelDetailedSection/StudentSkillLevelDetailedSection.vue'
import StudentSkillProgressSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillProgressSection/StudentSkillProgressSection.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { skillDetailed } = defineProps<{ skillDetailed: SkillDetailedDTO | undefined }>()

enum SkillItems {
  SKILL_DETAILED = 'SKILL_DETAILED',
  SKILL_PROGRESS = 'SKILL_PROGRESS',
  SKILL_EVALUATE = 'SKILL_EVALUATE'
}

type LevelItemId = `level:${string}`

const { t } = useI18n()

const levelNavItems = computed<SectionNavigationItem[]>(() =>
  (skillDetailed?.skillLevels ?? []).map(level => ({
    id: `level:${level.id}` as LevelItemId,
    label: level.name.toUpperCase(),
    icon: MDI_ICONS.FILE_TREE_OUTLINE,
  })),
)

const allItems = computed<SectionNavigationItem[]>(() => [
  {
    id: SkillItems.SKILL_DETAILED,
    label: skillDetailed?.name.toUpperCase() ?? '',
    icon: MDI_ICONS.STAR_SHOOTING_OUTLINE,
  },
  ...levelNavItems.value,
  {
    id: SkillItems.SKILL_PROGRESS,
    label: t('student.skills.views.StudentSkillView.progress.title').toUpperCase(),
    icon: MDI_ICONS.CHART_TIMELINE_VARIANT_SHIMMER,
  },
  {
    id: SkillItems.SKILL_EVALUATE,
    label: t('student.skills.views.StudentSkillView.evaluation.title').toUpperCase(),
    icon: MDI_ICONS.NOTEBOOK_CHECK,
  },
])

const items = computed<SectionNavigationItem[]>(() => {
  if (__DEMO_MODE__) {
    return allItems.value.slice(0, 1)
  }

  return allItems.value
})

const componentBySection = computed<Record<string, Component>>(() => ({
  [SkillItems.SKILL_DETAILED]: StudentSkillDetailedSection,
  [SkillItems.SKILL_PROGRESS]: StudentSkillProgressSection,
  [SkillItems.SKILL_EVALUATE]: StudentSkillEvaluateSection,
  ...Object.fromEntries(
    (skillDetailed?.skillLevels ?? []).map(level => [
      `level:${level.id}`,
      StudentSkillLevelDetailedSection,
    ]),
  ),
}))

const propsBySection = computed<Record<string, Record<string, unknown>>>(() => ({
  [SkillItems.SKILL_DETAILED]: {
    skillName: skillDetailed?.name ?? '',
  },
}))

const defaultSection = SkillItems.SKILL_DETAILED
</script>

<template>
  <div class="student-skill-view-container av-w-full">
    <SectionNavigationLayout
      :items="items"
      :default-section="defaultSection"
      :component-by-section="componentBySection"
      :props-by-section="propsBySection"
      :select-placeholder="t('student.global.navigation.selects.label')"
      :select-label="t('student.global.navigation.selects.label')"
      data-testid="student-skill-view-layout"
    />
  </div>
</template>

<style lang="scss" scoped>
.student-skill-view-container {
  min-height: calc(100vh - 28.15rem);
}
</style>
