<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="main-container">
    <div class="title-container">
      <h5 class="n5">
        {{ t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewEducationTab.title') }}
        <span class="b1-regular">
          {{ t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewEducationTab.subtitle') }}
        </span>
      </h5>
    </div>
    <div class="skills-container">
      TODO Placeholder #412...
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
}

.title-container {
  padding-bottom: var(--spacing-sm);
}

.skills-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.n5, .b1-regular {
  color: var(--text1);
}
</style>
