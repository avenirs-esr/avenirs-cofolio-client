<script setup lang="ts">
import { useGlobalBackgroundColor } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import Tutorial from '@/common/components/overlay/tooltips/Tutorial/Tutorial.vue'
import { useCanAccessRoute } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import ActivitiesWidget from '@/features/student/global/views/StudentHomeView/components/ActivitiesWidget/ActivitiesWidget.vue'
import { TracesWidget } from '@/features/student/traces'
import { StudentOverviewWidget } from '@/features/student/user'

useGlobalBackgroundColor('var(--surface-background)')
const { t } = useI18n()

const canAccessActivities = useCanAccessRoute(ROUTES.STUDENT.ACTIVITIES)
const canAccessTraces = useCanAccessRoute(ROUTES.STUDENT.TOOLS_TRACES)
</script>

<template>
  <h1 class="av-sr-only">
    {{ t('student.global.views.studentHomeView.title') }}
  </h1>
  <div class="layout-home av-row av-wrap av-nowrap--md av-justify-center--md av-gap-xl av-align-start">
    <div class="layout-home__sidebar av-col av-gap-xl av-sticky--md av-top-sm">
      <StudentOverviewWidget />
    </div>
    <div class="layout-home__main av-col av-gap-xl">
      <template v-if="canAccessActivities">
        <ActivitiesWidget />
        <ActivitiesWidget is-new />
      </template>
      <TracesWidget v-if="canAccessTraces" />
    </div>
  </div>

  <Tutorial />
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
