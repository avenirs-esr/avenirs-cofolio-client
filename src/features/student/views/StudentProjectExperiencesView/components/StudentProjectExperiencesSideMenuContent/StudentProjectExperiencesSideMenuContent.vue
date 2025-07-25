<script setup lang="ts">
import { isEnumMember } from '@/common/utils'
import { ProjectExperienceItems } from '@/features/student/views/StudentProjectExperiencesView/types'
import { AvList, AvListItem, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

export interface StudentProjectExperiencesSideMenuContentProps {
  isSideMenuCollapsed: boolean
}

defineProps<StudentProjectExperiencesSideMenuContentProps>()

const { t } = useI18n()

const selectedItem = defineModel<ProjectExperienceItems, ProjectExperienceItems>('selectedItem', {
  default: ProjectExperienceItems.CAREERS,
})

const menuItems = computed<{ id: ProjectExperienceItems, title: string, icon: string }[]>(() => [
  {
    id: ProjectExperienceItems.CAREERS,
    title: t('student.views.studentProjectExperiencesView.careers.title'),
    icon: MDI_ICONS.BRIEFCASE_VARIANT_OUTLINE,
  },
  {
    id: ProjectExperienceItems.EDUCATIONS,
    title: t('student.views.studentProjectExperiencesView.educations.title'),
    icon: MDI_ICONS.SCHOOL_OUTLINE
  },
  {
    id: ProjectExperienceItems.EXPERIENCES,
    title: t('student.views.studentProjectExperiencesView.experiences.title'),
    icon: MDI_ICONS.VECTOR_POLYGON_VARIANT
  },
  {
    id: ProjectExperienceItems.ACTIVITIES,
    title: t('student.views.studentProjectExperiencesView.activities.title'),
    icon: MDI_ICONS.TARGET_ARROW
  }
])

function handleSelectItem (itemId: string) {
  if (isEnumMember(ProjectExperienceItems, itemId)) {
    selectedItem.value = itemId
  }
}
</script>

<template>
  <AvList
    size="small"
    role="menu"
  >
    <AvListItem
      v-for="item in menuItems"
      :key="item.id"
      :title="isSideMenuCollapsed ? undefined : item.title"
      :icon="item.icon"
      :icon-size="1.8"
      :selected="selectedItem === item.id"
      tag="button"
      role="menuitem"
      class="student-project-experiences-container__menu-item"
      :class="{
        'student-project-experiences-container__menu-item--collapsed': isSideMenuCollapsed,
      }"
      clickable
      @click="handleSelectItem(item.id)"
    />
  </AvList>
</template>

<style lang="scss" scoped>
.student-project-experiences-container__menu-item {
  border-radius: var(--radius-xl) 0 0 var(--radius-xl);

  &--collapsed {
    justify-content: center;

    :deep(.av-list-item__content) {
      display: none;
    }
  }
}
</style>
