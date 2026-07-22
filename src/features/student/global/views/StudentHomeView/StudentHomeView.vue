<script setup lang="ts">
import { StudentSkillsWidget } from '@/features/student/skills'
import { TracesWidget } from '@/features/student/traces'
import { StudentOverviewWidget } from '@/features/student/user'
import { useGlobalBackgroundColor } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

useGlobalBackgroundColor('var(--surface-background)')
const { t } = useI18n()
</script>

<template>
  <h1 class="av-sr-only">
    {{ t('student.global.views.studentHomeView.title') }}
  </h1>
  <div class="layout-home av-row av-wrap av-nowrap--md av-justify-center--md av-gap-xl av-align-start">
    <div class="layout-home__sidebar av-col av-gap-xl">
      <StudentOverviewWidget />
    </div>
    <div class="layout-home__main av-col av-gap-xl">
      <StudentSkillsWidget />
      <TracesWidget />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.layout-home {
  &__sidebar, &__main {
    flex: 1 1 100%;
    max-width: 100%;
  }

  @include dsav.min-width(md) {
    &__sidebar {
      flex: 0 1 400px;
      min-width: 300px;
    }

    &__main {
      flex: 1 1 300px;
      min-width: 300px;
    }
  }
}
</style>
