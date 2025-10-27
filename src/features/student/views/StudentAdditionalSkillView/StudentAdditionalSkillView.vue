<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { studentHomeRoute, studentProjectSkillsRoute } from '@/features/student/routes'
import AdditionalSkillSettingDropdown
  from '@/features/student/views/StudentAdditionalSkillView/components/AdditionalSkillSettingDropdown/AdditionalSkillSettingDropdown.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentAdditionalSkillViewProps {
  skillId: string
}

defineProps<StudentAdditionalSkillViewProps>()

enum StudentAdditionalSkillViewTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const { t } = useI18n()

const activeTab = ref(StudentAdditionalSkillViewTabs.DETAILS)
const skillTitle = ref<string>('Placeholder Skill Title')

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.skills'), to: studentProjectSkillsRoute },
  { text: t('student.navigation.tabs.project.items.additionalSkills') }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentAdditionalSkillView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="studentProjectSkillsRoute"
  />

  <div class="student-additional-skill-view__title">
    <span class="n4">{{ skillTitle }}</span>
  </div>

  <div class="student-additional-skill-view__actions">
    <AdditionalSkillSettingDropdown />
  </div>

  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.views.studentAdditionalSkillView.tabs.details.title')"
      :icon="MDI_ICONS.INFORMATION_OUTLINE"
    >
      Placeholder for AdditionalSkillDetails
    </AvTab>
    <AvTab
      :title="t('student.views.studentAdditionalSkillView.tabs.associations.title', { count: 4 })"
      :icon="MDI_ICONS.LINK"
    >
      Placeholder for AdditionalSkillAssociations
    </AvTab>
  </AvTabs>
</template>

<style lang="scss" scoped>
.student-additional-skill-view {

  &__title {
    padding: var(--spacing-md) 0;
    display: flex;
    flex-direction: row;

    .n4 {
      color: var(--text2);
    }
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
    padding:  var(--spacing-md) 0;
  }
}
</style>
