<script setup lang="ts">
import { AvBadge, IX_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <AvBadge
    :label="t('student.buildProject.activities.badges.activityNewBadge.label')"
    :icon="IX_ICONS.LIBRARY_NEW"
    color="var(--dark-background-success)"
    background-color="var(--light-background-success)"
    small
  />
</template>
