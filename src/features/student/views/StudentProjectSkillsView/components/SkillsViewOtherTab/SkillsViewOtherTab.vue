<script setup lang="ts">
import { AvButton, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function handleAddSkill (): void {
  // TODO: Action will be implemented in a future task
}
</script>

<template>
  <div class="skills-view-other-tab">
    <div class="skills-view-other-tab__button-container">
      <AvButton
        variant="OUTLINED"
        :label="t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addSkillButton')"
        :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        @click="handleAddSkill"
      />
    </div>
    <div class="skills-view-other-tab__content-placeholder">
      TODO #416 Placeholder...
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skills-view-other-tab {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.skills-view-other-tab__button-container {
  display: flex;
  justify-content: flex-end;
}
</style>
