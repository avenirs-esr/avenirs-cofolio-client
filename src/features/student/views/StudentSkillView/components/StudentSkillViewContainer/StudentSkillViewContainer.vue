<script setup lang="ts">
import type { SkillDetailedDTO } from '@/api/avenir-esr'
import type { Component } from 'vue'
import StudentSkillDetailedSection
  from '@/features/student/views/StudentSkillView/components/StudentSkillDetailedSection/StudentSkillDetailedSection.vue'
import StudentSkillEvaluateSection
  from '@/features/student/views/StudentSkillView/components/StudentSkillEvaluateSection/StudentSkillEvaluateSection.vue'
import StudentSkillLevelDetailedSection
  from '@/features/student/views/StudentSkillView/components/StudentSkillLevelDetailedSection/StudentSkillLevelDetailedSection.vue'
import StudentSkillProgressSection
  from '@/features/student/views/StudentSkillView/components/StudentSkillProgressSection/StudentSkillProgressSection.vue'
import { SkillItems } from '@/features/student/views/StudentSkillView/types'
import { AvSideNavigation, type AvSideNavigationItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ skillDetailed: SkillDetailedDTO | undefined }>()
const { skillDetailed } = toRefs(props)
const { t } = useI18n()
const isSideMenuCollapsed = ref<boolean>(false)

type LevelItemId = `level:${string}`
type SelectedId = SkillItems | LevelItemId
const selectedItem = ref<SelectedId>(SkillItems.SKILL_DETAILED)

function isLevelId (id: SelectedId): id is LevelItemId {
  return typeof id === 'string' && id.startsWith('level:')
}

const levelNavItems = computed<AvSideNavigationItem[]>(() =>
  (skillDetailed.value?.skillLevels ?? []).map(l => ({
    id: `level:${l.id}` as LevelItemId,
    label: l.name.toUpperCase(),
    icon: MDI_ICONS.FILE_TREE_OUTLINE,
  }))
)

const ALL_ITEMS: AvSideNavigationItem[] = [
  {
    id: SkillItems.SKILL_DETAILED,
    label: skillDetailed.value?.name.toUpperCase() || '',
    icon: MDI_ICONS.STAR_SHOOTING_OUTLINE,
  },
  ...levelNavItems.value,
  {
    id: SkillItems.SKILL_PROGRESS,
    label: t('student.views.studentSkillView.skillProgress.title'),
    icon: MDI_ICONS.CHART_TIMELINE_VARIANT_SHIMMER
  },
  {
    id: SkillItems.SKILL_EVALUATE,
    label: t('student.views.studentSkillView.skillEvaluate.title'),
    icon: MDI_ICONS.NOTEBOOK_CHECK
  }
]

const items = computed<AvSideNavigationItem[]>(() => {
  if (__DEMO_MODE__) {
    return ALL_ITEMS.slice(0, 1)
  }
  return ALL_ITEMS
})

const displayedSection = computed<Component>(() => {
  if (isLevelId(selectedItem.value)) {
    return StudentSkillLevelDetailedSection
  }
  switch (selectedItem.value) {
    case SkillItems.SKILL_DETAILED: return StudentSkillDetailedSection
    case SkillItems.SKILL_PROGRESS: return StudentSkillProgressSection
    case SkillItems.SKILL_EVALUATE: return StudentSkillEvaluateSection
    default: return StudentSkillDetailedSection
  }
})
</script>

<template>
  <div class="student-skill-view-container">
    <AvSideNavigation
      v-model:is-side-menu-collapsed="isSideMenuCollapsed"
      v-model:selected-item="selectedItem"
      :items="items"
    />
    <div class="student-skill-view-container__content">
      <component
        :is="displayedSection"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-skill-view-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: calc(100vh - 28.15rem);

  &__content {
    flex: 1;
    padding: var(--spacing-lg);

    h2 {
      margin-bottom: var(--spacing-md);
    }
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-style: italic;
  }
}
</style>
